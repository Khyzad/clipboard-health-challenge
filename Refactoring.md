# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
The basic idea of deterministicPartitionKey is to create a new key using the event object passed to it. Going by the logic of the original code, a new key can only be generated under the following conditions:
- event is null, returning a trivial key "0"
- event.partitionKey is null
- event.partitionKey is too long

With that said, I'm able to immediately return a trivial key if the event object is null. If it isn't null, then a candidate key is either generated using the entire object, or the partition key is sanitized and either returned or used to generate a new partition key.

To minimize code duplication, I also decided to define the sha3-512 and hex objects to minimize magic strings. I also added some spacing and comments to explain at a high level what each step is doing. 

As for the unit tests, it suffices to test using hard-coded values to since the hash will always return the same result. The values themselves could also be assigned to a string for further cleanliness and possible reuse in other tests on different functions.