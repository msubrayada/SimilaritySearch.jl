# This file is a part of SimilaritySearch.jl
using Intersections

export maxlength, maxlength, getpair, getdist, getid, initialstate, idview, distview, reuse!

export KnnResult

"""
    KnnResult(ksearch::Integer)

Creates a priority queue with fixed capacity (`ksearch`) representing a knn result set.
It starts with zero items and grows with [`push!(res, id, dist)`](@ref) calls until `ksearch`
size is reached. After this only the smallest items based on distance are preserved.
"""
struct KnnResult # <: AbstractVector{Tuple{IdType,DistType}}
    id::Vector{Int32}
    dist::Vector{Float32}
    k::Int  # number of neighbors
end

function KnnResult(k::Integer)
    @assert k > 0
    res = KnnResult(Vector{Int32}(undef, 0), Vector{Float32}(undef, 0), k)
    sizehint!(res.id, k)
    sizehint!(res.dist, k)
    res
end

"""
    _shifted_fixorder!(res, shift=0)

Sorts the result in place; the possible element out of order is on the last entry always.
It implements a kind of insertion sort that it is efficient due to the expected
distribution of the items being inserted (it is expected just a few elements smaller than the current ones)
"""
function _shifted_fixorder!(res, shift=0)
    sp = shift + 1
    pos = N = lastindex(res.id)
    id = res.id
    dist = res.dist
   @inbounds id_, dist_ = res.id[end], res.dist[end]
    
    #pos = doublingsearch(dist, dist_, sp, N)
    #pos = binarysearch(dist, dist_, sp, N)
    #if N > 16
    #    pos = doublingsearchrev(dist, dist_, sp, N)::Int
    #else
        @inbounds while pos > sp && dist_ < dist[pos-1]
            pos -= 1
        end
    #end

    @inbounds if pos < N
        while N > pos
            id[N] = id[N-1]
            dist[N] = dist[N-1]
            N -= 1
        end

        dist[N] = dist_
        id[N] = id_
    end

    nothing
end


"""
    push!(res::KnnResult, item::Pair)
    push!(res::KnnResult, id::Integer, dist::Real)

Appends an item into the result set
"""
@inline function Base.push!(res::KnnResult, id::Integer, dist::Real)
    if length(res) < maxlength(res)
        k = res.k
        push!(res.id, id)
        push!(res.dist, dist)
    
        _shifted_fixorder!(res)
        return true
    end

    dist >= last(res.dist) && return false

    @inbounds res.id[end], res.dist[end] = id, dist
    _shifted_fixorder!(res)
    #_shifted_fixorder!(res.shift, res.id, res.dist)
    true
end

#@inline Base.push!(res::KnnResult, id::Integer, dist::Real) = push!(res, convert(Int32, id), convert(Float32, dist))
@inline Base.push!(res::KnnResult, p::Pair) = push!(res, p.first, p.second)

"""
    popfirst!(p::KnnResult)

Removes and returns the nearest neeighboor pair from the pool, an O(length(p.pool)) operation
"""
@inline function Base.popfirst!(res::KnnResult)
    popfirst!(res.id) => popfirst!(res.dist)
end

"""
    pop!(res::KnnResult)

Removes and returns the last item in the pool, it is an O(1) operation
"""
@inline function Base.pop!(res::KnnResult)
    pop!(res.id) => pop!(res.dist)
end

"""
    maxlength(res::KnnResult)

The maximum allowed cardinality (the k of knn)
"""
@inline maxlength(res::KnnResult) = res.k
@inline Base.length(res::KnnResult) = length(res.id)

"""
    reuse!(res::KnnResult)
    reuse!(res::KnnResult, k::Integer)

Returns a result set and a new initial state; reuse the memory buffers
"""
@inline function reuse!(res::KnnResult, k::Integer=res.k)
    @assert k > 0
    empty!(res.id)
    empty!(res.dist)
    if k > res.k
        sizehint!(res.id, k)
        sizehint!(res.dist, k)
    end
    KnnResult(res.id, res.dist, k)
end

"""
    getindex(res::KnnResult, i)

Access the i-th item in `res`
"""
@inline function getpair(res::KnnResult, i)
    @inbounds res.id[i] => res.dist[i]
end

@inline getid(res::KnnResult, i) = @inbounds res.id[i]
@inline getdist(res::KnnResult, i) = @inbounds res.dist[i]

@inline Base.last(res::KnnResult) = last(res.id) => last(res.dist)
@inline Base.first(res::KnnResult) = @inbounds res.id[1] => res.dist[1]
@inline Base.maximum(res::KnnResult) = last(res.dist)
@inline Base.minimum(res::KnnResult) = @inbounds res.dist[1]
@inline Base.argmax(res::KnnResult) = last(res.id)
@inline Base.argmin(res::KnnResult) = @inbounds res.id[1]

@inline idview(res::KnnResult) = res.id
@inline distview(res::KnnResult) = res.dist

@inline Base.eachindex(res::KnnResult) = 1:length(res)
Base.eltype(res::KnnResult) = Pair{Int32,Float32}

##### iterator interface
### KnnResult
"""
    Base.iterate(res::KnnResult, state::Int=1)

Support for iteration
"""
function Base.iterate(res::KnnResult, i::Int=1)
    n = length(res)
    (n == 0 || i > n) && return nothing
    @inbounds res.id[i] => res.dist[i], i+1
end