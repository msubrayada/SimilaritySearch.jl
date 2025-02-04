# This file is a part of SimilaritySearch.jl

export BeamSearchSpace

@with_kw struct BeamSearchSpace <: AbstractSolutionSpace
    bsize = 8:8:64
    Δ = [0.8, 0.9, 1.0, 1.1]                  # this really depends on the dataset, be careful
    bsize_scale = (s=1.5, p1=0.8, p2=0.8, lower=2, upper=512)  # all these are reasonably values
    Δ_scale = (s=1.07, p1=0.8, p2=0.8, lower=0.6, upper=2.0)  # that should work in most datasets
end

Base.hash(c::BeamSearch) = hash((c.bsize, c.Δ, c.maxvisits))
Base.isequal(a::BeamSearch, b::BeamSearch) = a.bsize == b.bsize && a.Δ == b.Δ && a.maxvisits == b.maxvisits
Base.eltype(::BeamSearchSpace) = BeamSearch
Base.rand(space::BeamSearchSpace) = BeamSearch(bsize=rand(space.bsize), Δ=rand(space.Δ))

function combine(a::BeamSearch, b::BeamSearch)
    bsize = ceil(Int, (a.bsize + b.bsize) / 2)
    Δ = (a.Δ + b.Δ) / 2
    BeamSearch(; bsize, Δ)
end

function mutate(space::BeamSearchSpace, c::BeamSearch, iter)
    bsize = SearchModels.scale(c.bsize; space.bsize_scale...)
    Δ = SearchModels.scale(c.Δ; space.Δ_scale...)
    BeamSearch(; bsize, Δ)
end

@with_kw mutable struct OptimizeParameters <: Callback
    kind::ErrorFunction = ParetoRecall()
    initialpopulation = 16
    params = SearchParams(maxpopulation=16, bsize=4, mutbsize=16, crossbsize=8, tol=-1.0, maxiters=16)
    ksearch::Int32 = 10
    numqueries::Int32 = 64
    space::BeamSearchSpace = BeamSearchSpace()
end

optimization_space(index::SearchGraph) = BeamSearchSpace()

function setconfig!(bs::BeamSearch, index::SearchGraph, perf)
    index.search_algo.bsize = bs.bsize
    index.search_algo.Δ = bs.Δ
    index.search_algo.maxvisits = ceil(Int, 2perf.visited[end])
end

function runconfig(bs::BeamSearch, index::SearchGraph, q, res::KnnResult, pools)
    search(bs, index, q, res, index.hints, pools; maxvisits = 4index.search_algo.maxvisits)
    # search(bs, index, q, res, index.hints, pools)
end

"""
    execute_callback(opt::OptimizeParameters, index::SearchGraph)

SearchGraph's callback for adjunting search parameters
"""
function execute_callback(opt::OptimizeParameters, index::SearchGraph)
    optimize!(index, opt)
end

function optimize!(
    index::SearchGraph,
    opt::OptimizeParameters;
    queries=nothing,
    numqueries=opt.numqueries,
    ksearch=opt.ksearch,
    initialpopulation=opt.initialpopulation,
    params=opt.params,
    verbose=index.verbose,
)
    optimize!(index, opt.kind, opt.space; queries, ksearch, numqueries, initialpopulation, verbose, params)
end

