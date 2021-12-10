# This file is a part of SimilaritySearch.jl

using SimilaritySearch, Random
using Test

#
# This file contains a set of tests for SearchGraph over databases of vectors (of Float32)
#

@testset "vector indexing with SearchGraph" begin
    # NOTE: The following algorithms are complex enough to say we are testing it doesn't have syntax errors, a more grained test functions are requiered
    Random.seed!(0)
    ksearch = 10
    n, m, dim = 100_000, 100, 4

    db = MatrixDatabase(rand(Float32, dim, n))
    queries = MatrixDatabase(rand(Float32, dim, m))

    dist = SqL2Distance()
    seq = ExhaustiveSearch(dist, db)
    gold = searchbatch(seq, queries, ksearch)

    for search_algo_fun in [() -> IHCSearch(restarts=4), () -> BeamSearch(bsize=2)]
        search_algo = search_algo_fun()
        @info "=================== $search_algo"
        graph = SearchGraph(; db=DynamicMatrixDatabase(Float32, dim), dist, search_algo=search_algo)
        graph.neighborhood.reduce = SatNeighborhood()
        append!(graph, db; parallel_block=8)
        timedsearchbatch(graph, queries, ksearch)
        @timev reslist, searchtime = timedsearchbatch(graph, queries, ksearch)
        recall = macrorecall(gold, reslist)        
        @info "testing search_algo: $(string(graph.search_algo)), time: $(searchtime)"
        @test recall >= 0.6
        @info "queries per second: $(1/searchtime), recall: $recall"
        @info "===="
    end

    @info "--- Optimizing parameters :pareto_distance_searchtime ---"
    graph = SearchGraph(; dist, search_algo=BeamSearch(bsize=2), verbose=false)
    graph.neighborhood.reduce = SatNeighborhood()
    append!(graph, db)
    @info "---- starting :pareto_distance_searchtime optimization ---"
    optimize!(graph, OptimizeParameters())
    reslist, searchtime = timedsearchbatch(graph, queries, ksearch)
    recall = macrorecall(gold, reslist)
    @info ":pareto_distance_search_time:> queries per second: ", 1/searchtime, ", recall:", recall
    @info graph.search_algo
    @test recall >= 0.6


    @info "---- starting :pareto_recall_searchtime optimization ---"
    optimize!(graph, OptimizeParameters(kind=:pareto_recall_searchtime))
    reslist, searchtime = timedsearchbatch(graph, queries, ksearch)
    recall = macrorecall(gold, reslist)
    @info ":pareto_recall_search_time:> queries per second: ", 1/searchtime, ", recall:", recall
    @info graph.search_algo
    @test recall >= 0.6
    

    @info "========================= Callback optimization ======================"
    @info "--- Optimizing parameters :pareto_distance_searchtime ---"
    graph = SearchGraph(; db, dist, search_algo=BeamSearch(bsize=2), verbose=false)
    graph.neighborhood.reduce = SatNeighborhood()
    push!(graph.callbacks, OptimizeParameters(kind=:pareto_distance_searchtime))
    index!(graph)
    reslist, searchtime = timedsearchbatch(graph, queries, ksearch)
    recall = macrorecall(gold, reslist)
    @info "testing without additional optimizations: queries per second:", 1/searchtime, ", recall: ", recall
    @info graph.search_algo
    @test recall >= 0.6

    @info "#############=========== Callback optimization 2 ==========###########"
    @info "--- Optimizing parameters :pareto_distance_searchtime L2 ---"
    dim = 4
    db = MatrixDatabase(ceil.(Int32, rand(Float32, dim, n) .* 100))
    queries = VectorDatabase(ceil.(Int32, rand(Float32, dim, m) .* 100))
    seq = ExhaustiveSearch(dist, db)
    gold = searchbatch(seq, queries, ksearch)
    graph = SearchGraph(; db, dist, search_algo=BeamSearch(bsize=2), verbose=false)
    graph.neighborhood.reduce = SatNeighborhood()
    push!(graph.callbacks, OptimizeParameters(kind=:pareto_recall_searchtime))
    index!(graph)
    #optimize!(graph, OptimizeParameters(kind=:minimum_recall_searchtime, minrecall=0.7))
    @timev reslist, searchtime = timedsearchbatch(graph, queries, ksearch)
    recall = macrorecall(gold, reslist)
    @info "testing without additional optimizations> queries per second:", 1/searchtime, ", recall: ", recall
    @info graph.search_algo
    @test recall >= 0.6
end
