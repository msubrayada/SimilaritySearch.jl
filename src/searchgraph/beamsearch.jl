# This file is a part of SimilaritySearch.jl

using Random

"""
    BeamSearch(bsize::Integer=16, Δ::Float32)

BeamSearch is an iteratively improving local search algorithm that explores the graph using blocks of `bsize` elements and neighborhoods at the time.

- `bsize`: The size of the beam.
- `Δ`: Soft margin for accepting elements into the beam
- `maxvisits`: MAximum visits while searching, useful for early stopping without convergence
"""
@with_kw mutable struct BeamSearch <: LocalSearchAlgorithm
    bsize::Int32 = 8  # size of the search beam
    Δ::Float32 = 1.0  # soft-margin for accepting an element into the beam
    maxvisits::Int64 = 1000_000 # maximum visits by search, useful for early stopping without convergence, very high by default
end

Base.copy(bsearch::BeamSearch; bsize=bsearch.bsize, Δ=bsearch.Δ, maxvisits=bsearch.maxvisits) =
    BeamSearch(; bsize, Δ, maxvisits)

const GlobalBeamKnnResult = [KnnResultShift(32)]  # see __init__ function

function __init__beamsearch()
    for _ in 2:Threads.nthreads()
        push!(GlobalBeamKnnResult, KnnResultShift(32))
    end
end

### local search algorithm

@inline function beamsearch_queue(index::SearchGraph, q, res::KnnResult, objID, vstate)
    visited(vstate, objID) && return 0
    visit!(vstate, objID)
    @inbounds push!(res, objID, evaluate(index.dist, q, index[objID]))
    1
end

function beamsearch_init(bs::BeamSearch, index::SearchGraph, q, res::KnnResult, hints, vstate, bsize)
    visited_ = 0

    for objID in hints
        visited_ += beamsearch_queue(index, q, res, objID, vstate)
    end
    
    if length(res) == 0
        _range = 1:length(index)
        for _ in 1:bsize
           objID = rand(_range)
           visited_ += beamsearch_queue(index, q, res, objID, vstate)
       end
    end

    visited_
end

function beamsearch_inner(bs::BeamSearch, index::SearchGraph, q, res, vstate, beam, Δ, maxvisits, visited_)
    beam_st = initialstate(beam)
    beam_st = push!(beam, beam_st, argmin(res), minimum(res))

    while length(beam, beam_st) > 0
        p, beam_st = popfirst!(beam, beam_st)
        prev_id = p.first

        @inbounds for childID in index.links[prev_id]
            visited(vstate, childID) && continue
            visit!(vstate, childID)
            d = evaluate(index.dist, q, index[childID])
            push!(res, childID, d)
            visited_ += 1
            visited_ > maxvisits && @goto finish_search
            if d <= Δ * maximum(res)
                beam_st = push!(beam, beam_st, childID, d)
                # sat_should_push(keys(beam), index, q, childID, d) && push!(beam, childID, d)
            end
        end
    end

    @label finish_search
    (res=res, cost=visited_)
end

"""
    search(bs::BeamSearch, index::SearchGraph, q, res, hints, pools; bsize=bs.bsize, Δ=bs.Δ, maxvisits=bs.maxvisits)

Tries to reach the set of nearest neighbors specified in `res` for `q`.
- `bs`: the parameters of `BeamSearch`
- `index`: the local search index
- `q`: the query
- `res`: The result object, it stores the results and also specifies the kind of query
- `hints`: Starting points for searching, randomly selected when it is an empty collection
- `pools`: A SearchGraphPools object with preallocated pools

Optional arguments (defaults to values in `bs`)
- `bsize`: Beam size
- `Δ`: exploration expansion factor
- `maxvisits`: Maximum number of nodes to visit (distance evaluations)

"""
function search(bs::BeamSearch, index::SearchGraph, q, res, hints, pools::SearchGraphPools; bsize=bs.bsize, Δ=bs.Δ, maxvisits=bs.maxvisits, vstate=getvstate(length(index), pools))
    # k is the number of neighbors in res
    visited_ = beamsearch_init(bs, index, q, res, hints, vstate, bsize)
    beam = getbeam(bsize, pools)
    beamsearch_inner(bs, index, q, res, vstate, beam, Δ, maxvisits, visited_)
end
