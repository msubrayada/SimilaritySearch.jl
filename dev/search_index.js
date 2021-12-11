var documenterSearchIndex = {"docs":
[{"location":"diststrings/","page":"String alignments","title":"String alignments","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"diststrings/#String-distances","page":"String alignments","title":"String distances","text":"","category":"section"},{"location":"diststrings/","page":"String alignments","title":"String alignments","text":"The following string distances are supported. Please recall that we use the evaluate function definition from Distances.jl.","category":"page"},{"location":"diststrings/#Levenshtein-(edit)-distance-function","page":"String alignments","title":"Levenshtein (edit) distance function","text":"","category":"section"},{"location":"diststrings/","page":"String alignments","title":"String alignments","text":"\nLevenshteinDistance\nevaluate(::LevenshteinDistance, a, b)","category":"page"},{"location":"diststrings/#SimilaritySearch.LevenshteinDistance","page":"String alignments","title":"SimilaritySearch.LevenshteinDistance","text":"LevenshteinDistance()\n\nInstantiates a GenericLevenshteinDistance object to perform traditional levenshtein distance\n\n\n\n\n\n","category":"function"},{"location":"diststrings/#Longest-common-subsequence-(LCS)-distance-function","page":"String alignments","title":"Longest common subsequence (LCS) distance function","text":"","category":"section"},{"location":"diststrings/","page":"String alignments","title":"String alignments","text":"\nLcsDistance\nevaluate(::LcsDistance, a, b)","category":"page"},{"location":"diststrings/#SimilaritySearch.LcsDistance","page":"String alignments","title":"SimilaritySearch.LcsDistance","text":"LcsDistance()\n\nInstantiates a GenericLevenshteinDistance object to perform LCS distance\n\n\n\n\n\n","category":"function"},{"location":"diststrings/#Generic-Levenshtein-distance-function","page":"String alignments","title":"Generic Levenshtein distance function","text":"","category":"section"},{"location":"diststrings/","page":"String alignments","title":"String alignments","text":"\nGenericLevenshteinDistance\nevaluate(::GenericLevenshteinDistance, a, b)","category":"page"},{"location":"diststrings/#SimilaritySearch.GenericLevenshteinDistance","page":"String alignments","title":"SimilaritySearch.GenericLevenshteinDistance","text":"GenericLevenshteinDistance(;icost, dcost, rcost)\n\nThe levenshtein distance measures the minimum number of edit operations to convert one string into another. The costs insertion icost, deletion cost dcost, and replace cost rcost. Not thread safe, use a copy of for each thread.\n\n\n\n\n\n","category":"type"},{"location":"diststrings/#Distances.evaluate-Tuple{GenericLevenshteinDistance, Any, Any}","page":"String alignments","title":"Distances.evaluate","text":"evaluate(::GenericLevenshteinDistance, a, b)\n\nComputes the edit distance between two strings, this is a low level function\n\n\n\n\n\n","category":"method"},{"location":"diststrings/#Common-prefix-dissimilarity-function","page":"String alignments","title":"Common prefix dissimilarity function","text":"","category":"section"},{"location":"diststrings/","page":"String alignments","title":"String alignments","text":"\nCommonPrefixDissimilarity\nevaluate(::CommonPrefixDissimilarity, a, b)","category":"page"},{"location":"diststrings/#SimilaritySearch.CommonPrefixDissimilarity","page":"String alignments","title":"SimilaritySearch.CommonPrefixDissimilarity","text":"CommonPrefixDissimilarity()\n\nUses the common prefix as a measure of dissimilarity between two strings\n\n\n\n\n\n","category":"type"},{"location":"diststrings/#Distances.evaluate-Tuple{CommonPrefixDissimilarity, Any, Any}","page":"String alignments","title":"Distances.evaluate","text":"evaluate(::CommonPrefixDissimilarity, a, b)\n\nComputes a dissimilarity based on the common prefix between two strings\n\n\n\n\n\n","category":"method"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"SearchGraph creates a graph","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"Tellez, E. S., Ruiz, G., Chavez, E., & Graff, M.A scalable solution to the nearest neighbor search problem through local-search methods on neighbor graphs. Pattern Analysis and Applications, 1-15.","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"As before, we need a dataset X and a distance function.","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"using SimilaritySearch\nX = [randn(3) for i in 1:10_000]\nQ = [randn(3) for i in 1:5]\n\n\nindex = SearchGraph(; dist=L2Distance(), verbose=true)\nappend!(index, X)\n\nfor q in Q\n    println(search(index, q, KnnResult(3)))\nend","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"There are a several options for the construction of the index, from specifying the precise searching algorithm (search_algo) and the neighborhood strategy to be used on construction (neighborhood_algo). You can also specify here if the construction will be made in parallel and how this paralllelism will be performed (firstblock, block).","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"\nSearchGraph\nSearchGraphOptions\n","category":"page"},{"location":"searchgraph/#SimilaritySearch.SearchGraph","page":"SearchGraph","title":"SimilaritySearch.SearchGraph","text":"struct SearchGraph <: AbstractSearchContext\n\nSearchGraph index. It stores a set of points that can be compared through a distance function dist. The performance is determined by the search algorithm search_algo and the neighborhood policy. It supports callbacks to adjust parameters as insertions are made.\n\nhints: Initial points for exploration (empty hints imply using random points)\n\nNote: Parallel insertions should be made through append! function with parallel_block > 1\n\n\n\n\n\n","category":"type"},{"location":"searchgraph/#Local-search-algorithms","page":"SearchGraph","title":"Local search algorithms","text":"","category":"section"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"Regarding the search search algorithm, there are two alternatives, based on local search heuristics.","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"\nBeamSearch\n\n","category":"page"},{"location":"searchgraph/#SimilaritySearch.BeamSearch","page":"SearchGraph","title":"SimilaritySearch.BeamSearch","text":"BeamSearch(bsize::Integer=16, Δ::Float32)\n\nBeamSearch is an iteratively improving local search algorithm that explores the graph using blocks of bsize elements and neighborhoods at the time.\n\nbsize: The size of the beam.\nΔ: Soft margin for accepting elements into the beam\n\n\n\n\n\n","category":"type"},{"location":"searchgraph/#Neighborhood-algorithms","page":"SearchGraph","title":"Neighborhood algorithms","text":"","category":"section"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"Regarding neighborhood algorithms, the package defines the following ones:","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"Neighborhood algorithms","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"\nFixedNeighborhood\nLogNeighborhood\nLogSatNeighborhood\nSatNeighborhood\n","category":"page"},{"location":"searchgraph/#SimilaritySearch.SatNeighborhood","page":"SearchGraph","title":"SimilaritySearch.SatNeighborhood","text":"SatNeighborhood()\n\nNew items are connected with a small set of items computed with a SAT like scheme (cite). It starts with k near items that are reduced to a small neighborhood due to the SAT partitioning stage.\n\n\n\n\n\n","category":"type"},{"location":"searchgraph/#Incremental-construction-of-the-index","page":"SearchGraph","title":"Incremental construction of the index","text":"","category":"section"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"The index supports insertions; for instance, it can be fully constructed using insertions as follows:","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"using SimilaritySearch\n\nindex = SearchGraph()\n\nappend!(index, [rand(Float32, 4) for i in 1:1000])\n\nsearch(index, rand(Float32, 4), 3)","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"Each insertion is performed by the push! function or a chunk of items with append!; the last function also allows parallel insertions.","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"push!(::SearchGraph, elem)\nappend!(::SearchGraph, elem)","category":"page"},{"location":"searchgraph/#Base.push!-Tuple{SearchGraph, Any}","page":"SearchGraph","title":"Base.push!","text":"push!(index::SearchGraph, item)\n\nAppends item into the index.\n\n\n\n\n\n","category":"method"},{"location":"searchgraph/#Base.append!-Tuple{SearchGraph, Any}","page":"SearchGraph","title":"Base.append!","text":"append!(index::SearchGraph, db; parallel_block=1, parallel_minimum_first_block=parallel_block, apply_callbacks=true)\n\nAppends all items in db to the index. It can be made in parallel or sequentially. In case of a parallel appending, then:\n\nparallel_block must be bigger than 1 and describes the batch size to append in parallel (i.e., in the order of thousands, depending on the size of the db and the number of available threads).\nparallel_minimum_first_block indicates the minimum number of items inserted sequentially before going parallel, it can be 0 if the index is already populated, defaults to parallel_block.\n\nNote: Parallel doesn't trigger callbacks inside blocks.\n\n\n\n\n\n","category":"method"},{"location":"searchgraph/#Customizing-the-insertion-method","page":"SearchGraph","title":"Customizing the insertion method","text":"","category":"section"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"In particular, the procedure of pushing items into the index is made calling find_neighborhood and push_neighborhood; these methods can be overriden or used in other wyas to customize the insertion of data and the construction of the index.","category":"page"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"find_neighborhood\npush_neighborhood!\n","category":"page"},{"location":"searchgraph/#SimilaritySearch.find_neighborhood","page":"SearchGraph","title":"SimilaritySearch.find_neighborhood","text":"find_neighborhood(index::SearchGraph{T}, item)\n\nSearches for item neighborhood in the index, i.e., if item were in the index whose items should be its neighbors (intenal function). res is always reused since reduce creates a new KnnResult from it (a copy if reduce in its simpler terms)\n\n\n\n\n\n","category":"function"},{"location":"searchgraph/#SimilaritySearch.push_neighborhood!","page":"SearchGraph","title":"SimilaritySearch.push_neighborhood!","text":"push_neighborhood!(index::SearchGraph, item, neighbors; push_item=true, apply_callbacks=true)\n\nInserts the object item into the index, i.e., creates an edge from items listed in L and the vertex created for ìtem` (internal function)\n\n\n\n\n\n","category":"function"},{"location":"searchgraph/#Optimizing-the-index's-performance","page":"SearchGraph","title":"Optimizing the index's performance","text":"","category":"section"},{"location":"searchgraph/","page":"SearchGraph","title":"SearchGraph","text":"optimize!","category":"page"},{"location":"searchgraph/#SimilaritySearch.optimize!","page":"SearchGraph","title":"SimilaritySearch.optimize!","text":"optimize!(\n    index::SearchGraph,\n    opt::OptimizeParameters;\n    queries=nothing,\n    scalemaxvisits=1.0,\n    maxvisits=2 * index.search_algo.maxvisits,\n    verbose=index.verbose\n)\n\nOptimizes the index using the opt parameters. If queries=nothing then it selects a small sample randomply from  the already indexed objects; this sample size and the number of neighbors are also parameters in opt.\n\nNote: The visits parameters is a factor allowing early stopping based on the number of distance evaluations seen in the optimization procedure; please note that in some cases this will reduce the quality to limit the search times. Please also take into account that inserting items after limiting visits may also cause severe quality degradation when maxvisits is not also updated as required. You can always adjust maxvisits modifying index.search_algo.maxvisits.\n\n\n\n\n\n","category":"function"},{"location":"searching/","page":"Searching","title":"Searching","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"searching/","page":"Searching","title":"Searching","text":"This package focus on solving k-NN queries, that is, retrieving the k nearest neighbors of a given query in a collection of items under a distance function. The distance function is often a metric function.","category":"page"},{"location":"searching/","page":"Searching","title":"Searching","text":"The general procedure is as follows:","category":"page"},{"location":"searching/","page":"Searching","title":"Searching","text":"using SimilaritySearch\nX = [randn(3) for i in 1:10_000]\nQ = [randn(3) for i in 1:5]\n\n\nindex = ExhaustiveSearch(L2Distance(), X)\n\n[search(index, q, KnnResult(3)) for q in Q]\n","category":"page"},{"location":"searching/","page":"Searching","title":"Searching","text":"Given a dataset X, we need to create an index structure; in this example, we created a sequential search index named ExhaustiveSearch. The search is performed by search. This function recieves the index, the query and the specification of the query (i.e., the KnnResult object, which also works as container of the result set).","category":"page"},{"location":"searching/","page":"Searching","title":"Searching","text":"Regarding the distance function, SimilaritySearch.jl defines several distance functions, but also can work with any of the distance functions specified in Distances.jl package.","category":"page"},{"location":"searching/#Other-similarity-search-indexes","page":"Searching","title":"Other similarity search indexes","text":"","category":"section"},{"location":"searching/","page":"Searching","title":"Searching","text":"The ExahustiveSearch index performs an exhaustive evaluation of the query against each element of the dataset, but without any preprocessing cost.","category":"page"},{"location":"searching/","page":"Searching","title":"Searching","text":"In addition of this, the package implements other indexes that can improve the search cost in diverse situations. These indexes have memory and preprocessing time requirements that must be considered in any real application.","category":"page"},{"location":"searching/#Approximate-search","page":"Searching","title":"Approximate search","text":"","category":"section"},{"location":"searching/","page":"Searching","title":"Searching","text":"Performs approximate search; they could solve the query, i.e., the result can lost some items or include some others not being part of the exact solution. In contrast, these indexes are often quite faster and more flexible than exact search methods.","category":"page"},{"location":"searching/","page":"Searching","title":"Searching","text":"SearchGraph: Very fast and precise similarity search index; supports multithreading construction (cite).\nKnr: Indexes based on K nearest references (external package, cite).\nDeloneInvIndex: An index based on a delone partition (external package, cite).","category":"page"},{"location":"searching/#Exact-search","page":"Searching","title":"Exact search","text":"","category":"section"},{"location":"searching/","page":"Searching","title":"Searching","text":"Kvp: K vantage points (cite).\nPivotedSearch: A generic pivot table (cite).\nsss: A pivot table with pivots selected with the SSS scheme (cite).\ndistant_tournament. A pivot table where pivots are selected using a simple distant tournament (cite).","category":"page"},{"location":"distminkowski/","page":"Minkowski distances","title":"Minkowski distances","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"distminkowski/#Minkowski-family-of-distance-functions","page":"Minkowski distances","title":"Minkowski family of distance functions","text":"","category":"section"},{"location":"distminkowski/","page":"Minkowski distances","title":"Minkowski distances","text":"The following distinguished members of the Minkowski family of distance functions are provided; please recall that we use the evaluate function definition from Distances.jl.","category":"page"},{"location":"distminkowski/","page":"Minkowski distances","title":"Minkowski distances","text":"\nL1Distance\nevaluate(::L1Distance, a, b)","category":"page"},{"location":"distminkowski/#SimilaritySearch.L1Distance","page":"Minkowski distances","title":"SimilaritySearch.L1Distance","text":"L1Distance()\n\nThe manhattan distance or L_1 is defined as\n\nL_1(u v) = sum_iu_i - v_i\n\n\n\n\n\n","category":"type"},{"location":"distminkowski/#Distances.evaluate-Tuple{L1Distance, Any, Any}","page":"Minkowski distances","title":"Distances.evaluate","text":"evaluate(::L1Distance, a, b)\n\nComputes the Manhattan's distance between a and b\n\n\n\n\n\n","category":"method"},{"location":"distminkowski/#Euclidean-distance","page":"Minkowski distances","title":"Euclidean distance","text":"","category":"section"},{"location":"distminkowski/","page":"Minkowski distances","title":"Minkowski distances","text":"L2Distance\nevaluate(::L2Distance, a, b)","category":"page"},{"location":"distminkowski/#SimilaritySearch.L2Distance","page":"Minkowski distances","title":"SimilaritySearch.L2Distance","text":"L2Distance()\n\nThe euclidean distance or L_2 is defined as\n\nL_2(u v) = sqrtsum_i(u_i - v_i)^2\n\n\n\n\n\n","category":"type"},{"location":"distminkowski/#Distances.evaluate-Tuple{L2Distance, Any, Any}","page":"Minkowski distances","title":"Distances.evaluate","text":"evaluate(::L2Distance, a, b)\n\nComputes the Euclidean's distance betweem a and b\n\n\n\n\n\n","category":"method"},{"location":"distminkowski/#Squared-euclidean-distance","page":"Minkowski distances","title":"Squared euclidean distance","text":"","category":"section"},{"location":"distminkowski/","page":"Minkowski distances","title":"Minkowski distances","text":"SqL2Distance\nevaluate(::SqL2Distance, a, b)","category":"page"},{"location":"distminkowski/#SimilaritySearch.SqL2Distance","page":"Minkowski distances","title":"SimilaritySearch.SqL2Distance","text":"SqL2Distance()\n\nThe squared euclidean distance is defined as\n\nL_2(u v) = sum_i(u_i - v_i)^2\n\nIt avoids the computation of the square root and should be used whenever you are able do it.\n\n\n\n\n\n","category":"type"},{"location":"distminkowski/#Distances.evaluate-Tuple{SqL2Distance, Any, Any}","page":"Minkowski distances","title":"Distances.evaluate","text":"evaluate(::SqL2Distance, a, b)\n\nComputes the squared Euclidean's distance between a and b\n\n\n\n\n\n","category":"method"},{"location":"distminkowski/#Chebyshev-distance","page":"Minkowski distances","title":"Chebyshev distance","text":"","category":"section"},{"location":"distminkowski/","page":"Minkowski distances","title":"Minkowski distances","text":"LInftyDistance\nevaluate(::LInftyDistance, a, b)\n","category":"page"},{"location":"distminkowski/#SimilaritySearch.LInftyDistance","page":"Minkowski distances","title":"SimilaritySearch.LInftyDistance","text":"LInftyDistance()\n\nThe Chebyshev or L_infty distance is defined as\n\nL_infty(u v) = max_ileft u_i - v_i right\n\n\n\n\n\n","category":"type"},{"location":"distminkowski/#Distances.evaluate-Tuple{LInftyDistance, Any, Any}","page":"Minkowski distances","title":"Distances.evaluate","text":"evaluate(::LInftyDistance, a, b)\n\nComputes the maximum distance or Chebyshev's distance\n\n\n\n\n\n","category":"method"},{"location":"distminkowski/#Generic-Minkowski-distance-functions","page":"Minkowski distances","title":"Generic Minkowski distance functions","text":"","category":"section"},{"location":"distminkowski/","page":"Minkowski distances","title":"Minkowski distances","text":"LpDistance\nevaluate(::LpDistance, a, b)\n","category":"page"},{"location":"distminkowski/#SimilaritySearch.LpDistance","page":"Minkowski distances","title":"SimilaritySearch.LpDistance","text":"LpDistance(p)\nLpDistance(p, pinv)\n\nThe general Minkowski distance L_p distance is defined as\n\nL_p(u v) = leftsum_i(u_i - v_i)^pright^1p\n\nWhere p_inv = 1p. Note that you can specify unrelated p and pinv if you need an specific behaviour.\n\n\n\n\n\n","category":"type"},{"location":"distminkowski/#Distances.evaluate-Tuple{LpDistance, Any, Any}","page":"Minkowski distances","title":"Distances.evaluate","text":"evaluate(lp::LpDistance, a, b)\n\nComputes generic Minkowski's distance\n\n\n\n\n\n","category":"method"},{"location":"distcos/","page":"Cosine and angle distances","title":"Cosine and angle distances","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"distcos/#Cosine-distance-functions","page":"Cosine and angle distances","title":"Cosine distance functions","text":"","category":"section"},{"location":"distcos/","page":"Cosine and angle distances","title":"Cosine and angle distances","text":"SimilaritySearch implements some cosine/angle distance functions. Please recall that we use the evaluate function definition from Distances.jl.","category":"page"},{"location":"distcos/#Cosine-distance-function","page":"Cosine and angle distances","title":"Cosine distance function","text":"","category":"section"},{"location":"distcos/","page":"Cosine and angle distances","title":"Cosine and angle distances","text":"CosineDistance\nevaluate(::CosineDistance, a, b)","category":"page"},{"location":"distcos/#SimilaritySearch.CosineDistance","page":"Cosine and angle distances","title":"SimilaritySearch.CosineDistance","text":"CosineDistance()\n\nThe cosine is defined as:\n\ncos(u v) = fracsum_i u_i v_isqrtsum_i u_i^2 sqrtsum_i v_i^2\n\nThe cosine distance is defined as 1 - cos(uv)\n\n\n\n\n\n","category":"type"},{"location":"distcos/#Distances.evaluate-Tuple{CosineDistance, Any, Any}","page":"Cosine and angle distances","title":"Distances.evaluate","text":"evaluate(::CosineDistance, a, b)\n\nComputes the cosine distance between two vectors. Please use AngleDistance if you are expecting a metric function (cosine_distance is a faster alternative whenever the triangle inequality is not needed)\n\n\n\n\n\n","category":"method"},{"location":"distcos/#Angle-distance-function","page":"Cosine and angle distances","title":"Angle distance function","text":"","category":"section"},{"location":"distcos/","page":"Cosine and angle distances","title":"Cosine and angle distances","text":"AngleDistance\nevaluate(::AngleDistance, a, b)","category":"page"},{"location":"distcos/#SimilaritySearch.AngleDistance","page":"Cosine and angle distances","title":"SimilaritySearch.AngleDistance","text":"AngleDistance()\n\nThe angle distance is defined as:\n\n(u v)= arccos(cos(u v))\n\n\n\n\n\n","category":"type"},{"location":"distcos/#Distances.evaluate-Tuple{AngleDistance, Any, Any}","page":"Cosine and angle distances","title":"Distances.evaluate","text":"evaluate(::AngleDistance, a, b)\n\nComputes the angle  between twovectors.\n\n\n\n\n\n","category":"method"},{"location":"distcos/#Normalized-cosine-distance-function","page":"Cosine and angle distances","title":"Normalized cosine distance function","text":"","category":"section"},{"location":"distcos/","page":"Cosine and angle distances","title":"Cosine and angle distances","text":"NormalizedCosineDistance\nevaluate(::NormalizedCosineDistance, a, b)\n","category":"page"},{"location":"distcos/#SimilaritySearch.NormalizedCosineDistance","page":"Cosine and angle distances","title":"SimilaritySearch.NormalizedCosineDistance","text":"NormalizedCosineDistance()\n\nSimilar to CosineDistance but suppose that input vectors are already normalized\n\n1 - sum_i u_i v_i\n\n\n\n\n\n","category":"type"},{"location":"distcos/#Distances.evaluate-Tuple{NormalizedCosineDistance, Any, Any}","page":"Cosine and angle distances","title":"Distances.evaluate","text":"evaluate(::NormalizedCosineDistance, a, b)\n\nComputes the cosine distance between two vectors, it expects normalized vectors (see normalize! method). Please use NormalizedAngleDistance if you are expecting a metric function (cosine_distance is a faster alternative whenever the triangle inequality is not needed)\n\n\n\n\n\n","category":"method"},{"location":"distcos/#Normalized-angle-distance-function","page":"Cosine and angle distances","title":"Normalized angle distance function","text":"","category":"section"},{"location":"distcos/","page":"Cosine and angle distances","title":"Cosine and angle distances","text":"NormalizedAngleDistance\nevaluate(::NormalizedAngleDistance, a, b)","category":"page"},{"location":"distcos/#SimilaritySearch.NormalizedAngleDistance","page":"Cosine and angle distances","title":"SimilaritySearch.NormalizedAngleDistance","text":"NormalizedAngleDistance()\n\nSimilar to AngleDistance but suppose that input vectors are already normalized\n\narccos sum_i u_i v_i\n\n\n\n\n\n","category":"type"},{"location":"distcos/#Distances.evaluate-Tuple{NormalizedAngleDistance, Any, Any}","page":"Cosine and angle distances","title":"Distances.evaluate","text":"evaluate(::AngleDistance, a, b)\n\nComputes the angle  between twovectors. It supposes that all vectors are normalized (see normalize! function)\n\n\n\n\n\n","category":"method"},{"location":"disthamming/","page":"Hamming distances","title":"Hamming distances","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"disthamming/#Hamming-distance-functions","page":"Hamming distances","title":"Hamming distance functions","text":"","category":"section"},{"location":"disthamming/","page":"Hamming distances","title":"Hamming distances","text":"The hamming distance for binary and string data is implemented. Please recall that we use the evaluate function definition from Distances.jl.","category":"page"},{"location":"disthamming/#Binary-hamming-distance-function","page":"Hamming distances","title":"Binary hamming distance function","text":"","category":"section"},{"location":"disthamming/","page":"Hamming distances","title":"Hamming distances","text":"\nBinaryHammingDistance\nevaluate(::BinaryHammingDistance, a, b)","category":"page"},{"location":"disthamming/#SimilaritySearch.BinaryHammingDistance","page":"Hamming distances","title":"SimilaritySearch.BinaryHammingDistance","text":"BinaryHammingDistance()\n\nBinary hamming uses bit wise operations to count the differences between bit strings\n\n\n\n\n\n","category":"type"},{"location":"disthamming/#Distances.evaluate-Tuple{BinaryHammingDistance, Any, Any}","page":"Hamming distances","title":"Distances.evaluate","text":"evaluate(::BinaryHammingDistance, a, b)\nevaluate(::BinaryHammingDistance, a::AbstractVector, b::AbstractVector) where {T<:Unsigned}\n\nComputes the binary hamming distance for bit types and arrays of bit types\n\n\n\n\n\n","category":"method"},{"location":"disthamming/#Hamming-distance-function","page":"Hamming distances","title":"Hamming distance function","text":"","category":"section"},{"location":"disthamming/","page":"Hamming distances","title":"Hamming distances","text":"\nStringHammingDistance\nevaluate(::StringHammingDistance, a, b)\n","category":"page"},{"location":"disthamming/#SimilaritySearch.StringHammingDistance","page":"Hamming distances","title":"SimilaritySearch.StringHammingDistance","text":"StringHammingDistance()\n\nThe hamming distance counts the differences between two equally sized strings\n\n\n\n\n\n","category":"type"},{"location":"disthamming/#Distances.evaluate-Tuple{StringHammingDistance, Any, Any}","page":"Hamming distances","title":"Distances.evaluate","text":" evaluate(::StringHammingDistance, a, b)\n\nComputes the hamming distance between two sequences of the same length\n\n\n\n\n\n","category":"method"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = SimilaritySearch","category":"page"},{"location":"#SimilaritySearch.jl","page":"Home","title":"SimilaritySearch.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"SimilaritySearch.jl is a library for nearest neighbor search. In particular, it contains the implementation for SearchGraph:","category":"page"},{"location":"","page":"Home","title":"Home","text":"Tellez, E. S., Ruiz, G., Chavez, E., & Graff, M.A scalable solution to the nearest neighbor search problem through local-search methods on neighbor graphs. Pattern Analysis and Applications, 1-15.","category":"page"},{"location":"","page":"Home","title":"Home","text":"@article{tellezscalable,\n  title={A scalable solution to the nearest neighbor search problem through local-search methods on neighbor graphs},\n  author={Tellez, Eric S and Ruiz, Guillermo and Chavez, Edgar and Graff, Mario},\n  journal={Pattern Analysis and Applications},\n  pages={1--15},\n  publisher={Springer}\n}","category":"page"},{"location":"#Installing-SimilaritySearch","page":"Home","title":"Installing SimilaritySearch","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You may install the package as follows","category":"page"},{"location":"","page":"Home","title":"Home","text":"] add SimilaritySearch","category":"page"},{"location":"","page":"Home","title":"Home","text":"also, you can run the set of tests as fol","category":"page"},{"location":"","page":"Home","title":"Home","text":"] test SimilaritySearch","category":"page"},{"location":"#Using-the-library","page":"Home","title":"Using the library","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Please see examples directory of this repository. Here you will find a list of Pluto's notebooks that exemplifies its usage.","category":"page"},{"location":"distsets/","page":"Sets distances","title":"Sets distances","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"distsets/#Set-distances","page":"Sets distances","title":"Set distances","text":"","category":"section"},{"location":"distsets/","page":"Sets distances","title":"Sets distances","text":"This functions use sets measure the distance between them; each set is represented as an array of sorted integers.  Please recall that we use the evaluate function definition from Distances.jl. The following set distances are supported.","category":"page"},{"location":"distsets/#Jaccard-distance-function","page":"Sets distances","title":"Jaccard distance function","text":"","category":"section"},{"location":"distsets/","page":"Sets distances","title":"Sets distances","text":"JaccardDistance\nevaluate(::JaccardDistance, a, b)","category":"page"},{"location":"distsets/#SimilaritySearch.JaccardDistance","page":"Sets distances","title":"SimilaritySearch.JaccardDistance","text":"JaccardDistance()\n\nThe Jaccard distance is defined as\n\nJ(u v) = fracu cap vu cup v\n\n\n\n\n\n","category":"type"},{"location":"distsets/#Distances.evaluate-Tuple{JaccardDistance, Any, Any}","page":"Sets distances","title":"Distances.evaluate","text":"evaluate(::JaccardDistance, a, b)\n\nComputes the Jaccard's distance of a and b both sets specified as sorted vectors.\n\n\n\n\n\n","category":"method"},{"location":"distsets/#Dice-distance-function","page":"Sets distances","title":"Dice distance function","text":"","category":"section"},{"location":"distsets/","page":"Sets distances","title":"Sets distances","text":"DiceDistance\nevaluate(::DiceDistance, a, b)","category":"page"},{"location":"distsets/#SimilaritySearch.DiceDistance","page":"Sets distances","title":"SimilaritySearch.DiceDistance","text":"DiceDistance()\n\nThe Dice distance is defined as\n\nD(u v) = frac2 u cap vu + v\n\n\n\n\n\n","category":"type"},{"location":"distsets/#Distances.evaluate-Tuple{DiceDistance, Any, Any}","page":"Sets distances","title":"Distances.evaluate","text":"evaluate(::DiceDistance, a, b)\n\nComputes the Dice's distance of a and b both sets specified as sorted vectors.\n\n\n\n\n\n","category":"method"},{"location":"distsets/#Intersection-dissimilarity-function","page":"Sets distances","title":"Intersection dissimilarity function","text":"","category":"section"},{"location":"distsets/","page":"Sets distances","title":"Sets distances","text":"IntersectionDissimilarity\nevaluate(::IntersectionDissimilarity, a, b)","category":"page"},{"location":"distsets/#SimilaritySearch.IntersectionDissimilarity","page":"Sets distances","title":"SimilaritySearch.IntersectionDissimilarity","text":"IntersectionDissimilarity()\n\nThe intersection dissimilarity uses the size of the intersection as a mesuare of similarity as follows:\n\nI(u v) = 1 - fracu cap vmax u v\n\n\n\n\n\n","category":"type"},{"location":"distsets/#Distances.evaluate-Tuple{IntersectionDissimilarity, Any, Any}","page":"Sets distances","title":"Distances.evaluate","text":"evaluate(::IntersectionDissimilarity, a, b)\n\nUses the intersection as a distance function (non-metric)\n\n\n\n\n\n","category":"method"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"knnresult/#KnnResult","page":"Knn results","title":"KnnResult","text":"","category":"section"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"SimilaritySearch's core is to solve knn searches; for this matter, it relies on a fixed size priority queue, the KnnResult struct and its related functions. The role of this struct is specifying and handling results.","category":"page"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"Its usage without searches is pretty simple, as it is exemplified in the next code.","category":"page"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"using SimilaritySearch\n\nres = KnnResult(3)\nfor i in 1:3\n    push!(res, i => rand())\nend\n\nprintln(\"first 3: \", collect(res))\n\nfor i in 4:10\n    push!(res, i => rand())\nend\n\nprintln(\"final: \", collect(res))","category":"page"},{"location":"knnresult/#Data-structures","page":"Knn results","title":"Data structures","text":"","category":"section"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"The KnnResult contains two aligned arrays 'id' and 'dist' and an indicator of its maximum capacity 'k'.","category":"page"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"KnnResult","category":"page"},{"location":"knnresult/#SimilaritySearch.KnnResult","page":"Knn results","title":"SimilaritySearch.KnnResult","text":"KnnResult(ksearch::Integer)\n\nCreates a priority queue with fixed capacity (ksearch) representing a knn result set. It starts with zero items and grows with push!(res, id, dist) calls until ksearch size is reached. After this only the smallest items based on distance are preserved.\n\n\n\n\n\n","category":"type"},{"location":"knnresult/#Length-and-capacity-of-the-queue","page":"Knn results","title":"Length and capacity of the queue","text":"","category":"section"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"using SimilaritySearch\n\nres = KnnResult(3)\nfor i in 1:5\n    push!(res, i => rand())\n    println(\"current length: $(length(res)), capacity: $(maxlength(res)), first-dist: $(first(res).dist), last-dist: $(last(res).dist), covrad: $(covrad(res))\")\nend\n","category":"page"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"The priority queue has a current length and a maximum capacity","category":"page"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"length(::KnnResult)\nmaxlength","category":"page"},{"location":"knnresult/#SimilaritySearch.maxlength","page":"Knn results","title":"SimilaritySearch.maxlength","text":"maxlength(res::KnnResultMatrix, st::KnnResultState)\n\nThe maximum allowed cardinality (the k of knn)\n\n\n\n\n\nmaxlength(res::KnnResult)\n\nThe maximum allowed cardinality (the k of knn)\n\n\n\n\n\n","category":"function"},{"location":"knnresult/#Bounds-of-the-queue","page":"Knn results","title":"Bounds of the queue","text":"","category":"section"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"covrad\nlast(::KnnResult)\nfirst(::KnnResult)","category":"page"},{"location":"knnresult/#Accessing-and-iterating","page":"Knn results","title":"Accessing and iterating","text":"","category":"section"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"getindex(::KnnResult, i)\neachindex(::KnnResult)\niterate(::KnnResult)","category":"page"},{"location":"knnresult/#Adding-and-removing-items","page":"Knn results","title":"Adding and removing items","text":"","category":"section"},{"location":"knnresult/","page":"Knn results","title":"Knn results","text":"empty!\npush!(::KnnResult, id, dist)\npopfirst!(::KnnResult)\npop!(::KnnResult)","category":"page"}]
}
