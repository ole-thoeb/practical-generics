# Sequence

A `Sequence<T>` is a collection of elements (of type `T`) similar to an `Array<T>`, but lazy. Lazy means that the operations on a `Sequence` are only executed if they are needed.
Additionally, this has the effect that no intermediate allocations (of storage memory) are needed, when chaining operations. 

Let's look an an example comparing both:
```ts
[1, 2, 3]
    .map(n => n * n)
    .filter((_, i) => i % 2 === 0)

Sequence.of(1, 2, 3)
    .map(n => n * n)
    .filter((_, i) => i % 2 === 0)
```

Here `array.map` allocates an intermediate array of size 3 while `sequence.map` performs no allocation for intermediate storage. In fact the sequence code doesn't produce a result at all, since the result is never used.
To get the sequence to perform the computation, we need to use the elements of the resulting sequence, e.g. by looping over the sequence.

```ts
const sequence = Sequence.of(1, 2, 3)
    .map(n => n * n)
    .filter((_, i) => i % 2 === 0)
for (const element of sequence) {
    // do something with element
}
```

If used wrong the array methods can do a lot of unnecessary work and allocations. Consider the following code to find the first element satisfying some condition:

```ts
// bad
const negativeElement = [69, -3, 42, 420, -17]
    .filter(n => n < 0)
    .at(0)
```

The predicate given to `array.filter` is applied to all elements, even though we found our result after the second application (namely `-3`). 
Also an array is allocated to hold both elements that match, even though we are only interested in the first.

Because of the above shortcomings `Array` provides a specialized method `array.find` that does the same thing, but short circuits and doesn't allocate.

```ts
// good
const negativeElement = [69, -3, 42, 420, -17]
    .find(n => n < 0)
```

When working with a `Sequence` the naive array code works like we want. Stopping the computation after finding `-3` and not allocating any additional storage.

```ts
// good
const negativeElement = Sequence.of(69, -3, 42, 420, -17)
    .filter(n => n < 0)
    .first()
```

Note that `Sequence` does not allow for indexing operations, hence `sequence.first` is used.

Another interesting property of a sequence is that, since it's lazy, it can contain infinitely many elements. We will explore this later.

## `Sequence.from`
At the core a sequences work on [iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator). 
Create a type `Sequence<T>` that extends `Iterable<T>`. Then create a function `Sequence.from` that takes an `Iterable` and returns a `Sequence`.

<details>
<summary>Hint 1</summary>

`Sequence` needs an `Iterator` and `Iterable` has one.
</details>

<details>
<summary>Hint 2</summary>

The [`Symbol.iterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) function of the sequence should delegate to the `Symbol.iterator` of the passed iterable.
</details>

## `Sequence.of`
Define a function `Sequence.of` that takes a variable number of arguments and returns a `Sequence` containing all the provided arguments.

<details>
<summary>Hint 1</summary>

`Array` is also an `Iterable`.
</details>

<details>
<summary>Signature hint</summary>

```ts
of<T>(...elements: readonly T[]): Sequence<T>
```
</details>

## `sequence.first`
Create the method `sequence.first` that either returns the first element of the sequence or `undefined` if the sequence is empty.

<details>
<summary>General implementation hint 1</summary>

All sequences are similar and only differ in the returned `Iterator`. Hence, it is useful to define all other methods in one place and reuse them across all sequences.
</details>

<details>
<summary>General implementation hint 2</summary>

Reusing the other methods can be achieved by implementing them in an abstract class, where only `Symbol.iterator` is abstract.

Another possibility is to define a factory function. It takes an implementation of a `Symbol.iterator` function and returns a `Sequence` defining all the other methods.
</details>

<details>
<summary>Hint 1</summary>

`Iterable`s like `Sequence` can be used together with a `for...of` loop.
</details>

<details>
<summary>Hint 2</summary>

Immediately return the iterated element in the body of the `for...of` loop.
</details>

<details>
<summary>Signature hint</summary>

```ts
first(): T | undefined
```
</details>

## `sequence.map`
Define the method `sequence.map` taking a function `mapper`. The `mapper` function transforms the `sequence` elementwise.
It takes as arguments both the element and the index of the element.  
The method returns a new sequence containing the transformed elements.
Remember that sequences are lazy. That is, no computation (e.g. calls to the `mapper`) should occur until the sequence is consumed.

In essence, this is the sequence equivalent of [`Array.prototype.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).


<details>
<summary>Implementation hint regarding iterators 1</summary>

The [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)
is relatively involved.

It is easier to make `[Symbol.iterator]` a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), specifically see [this example](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*#generator_as_a_computed_property). Either
```ts
*[Symbol.iterator](): Iterator<T> {
    // your impl
}
```
or 
```ts
createSequence(function*() { 
    // your impl
})
```
depending on if you are using classes or not.
</details>


<details>
<summary>Implementation hint regarding iterators 2</summary>

Example of how to create an iterator containing the values `1`, `2` and `this.a`:
```ts
// creating a local reference to `this` so that it gets captured by function*
const _this = this
(function* () {
    yield 1;
    yield 2;
    yield _this.a;
})()
```
</details>

<details>
<summary>Hint 1</summary>
Loop over the old sequence and `yield` the result of applying the `mapper`.
</details>

<details>
<summary>Signature hint 1</summary>

`map` must introduce a new type. The `mapper` function takes an element of the sequence's element type and a `number` and returns the new type.
</details>

<details>
<summary>Signature hint 2</summary>

```ts
map<U>(mapper: (element:T, index: number) => U): Sequence<U>
```
</details>

## `sequence.filter`
Implement the method `sequence.filter` that takes a `predicate` and returns a new `Sequence` without only elements matching the `predicate`.  
Similar to the `mapper` from `sequence.map`, the `predicate` function gets both an element and it's index, but it returns `true` or `false` signaling if the element satisfies the condition.  
Again, remember that sequences are lazy, e.g. no computation calls to `predicate` should occur until the sequence is consumed.

This is the sequence equivalent of [`Array.prototype.filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

<details>
<summary>Hint 1</summary>
Loop over the old sequence and `yield` the element only if it satisfies the `predicate`, otherwise continue with the next.
</details>

<details>
<summary>Signature hint 1</summary>

```ts
filter(predicate: (element:T, index: number) => boolean): Sequence<T>
```
</details>

<ins>**Challenge:**</ins> Adjust the typing of `sequence.filter` in such a way that it also works with [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).
For example, the following should type-check:
```ts
/**
 * Type predicate checking if the argument is a `Dog`.
 */
declare function isDog(catOrDog: Cat | Dog): catOrDog is Dog;
declare const catOrDogs: Sequence<Cat | Dog>;

const dogs: Sequence<Dog> = catOrDogs.filter(isDog);
```

<details>
<summary>Challenge hint 1</summary>

The version of `sequence.filter` must exist as a separate overload.
</details>

<details>
<summary>Challenge hint 2</summary>

The syntax for the type of a type predicate is as follows
```ts
myTypePredicate: (arg_1: A1, arg_2: A2, ..., arg_n: AN) => arg_i is T
```
</details>

<details>
<summary>Challenge hint 3</summary>

The overload must introduce a new type that the type predicates narrows to. The returned `Sequence` is of this new type.
</details>


<details>
<summary>Challenge hint 4</summary>

```ts
filter<S extends T>(predicate: (element: T, index: number) => element is S): Sequence<S>;
```
</details>

## Collectors
Until now we introduced functions that 
 - created a new sequence and
 - that transformed one sequence into another.
The missing third kind of functions materialize / collect the elements in the sequence back into a container (`Array`/`Map`/`Set`).
One could argue that we already introduced a function of this kind - [`sequence.first`](#sequencefirst) - only collecting the first element and disregarding the rest. 

### `sequence.toArray`
Implement the method `sequence.toArray` that consumes the `Sequence` and returns an `Array` that contains all the elements.

<details>
<summary>Hint 1</summary>

[`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) creates a new `Array` from an `Iterator`.
</details>

<details>
<summary>Signature hint 1</summary>

```ts
toArray(): T[]
```
</details>

### `sequence.toSet`
Implement the method `sequence.toSet` that consumes the `Sequence` and returns an `Set` that contains all the elements (excluding duplicates).

<details>
<summary>Hint 1</summary>

The [`Set constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set) can create an `Set` from an `Iterator`.
</details>

<details>
<summary>Signature hint 1</summary>

```ts
toSet(): Set<T>
```
</details>

### `sequence.toMap`
Implement the method `sequence.toMap` that consumes the `Sequence` only containing tuples and returns an `Map` that contains all the elements.  
A [tuple](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) is an potentially heterogenes, readonly `Array` with exactly two elements.
The first entry should become the key and the second value should become the value of the map entry.

<details>
<summary>Hint 1</summary>

The [`Map constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/Map) can create an `Map` from an `Iterator` of pairs.
</details>

<details>
<summary>Signature hint 1</summary>

Use a [this parameters](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-parameters) to constrain in which context the method is callable.

</details>

<details>
<summary>Signature hint 2</summary>

The type of the Sequence (`this`) must be `Sequence<readonly [K, V]>` where `K` and `V` are new types.

</details>

<details>
<summary>Signature hint 3</summary>

```ts
toMap<K, V>(this: Sequence<readonly [K, V]>): Map<K, V>
```
</details>

## Utility type `SequenceElement<S>`
Define the utility type `SequenceElement<S>` that evaluates to the element type if `S` is a `Sequence` and `never` otherwise.  
For example 
```ts
type A = SequenceElement<Sequence<string>> // string
type B = SequenceElement<string> // never
type C = SequenceElement<Sequence<Sequence<number>>> // Sequence<number>
```

<details>
<summary>Hint 1</summary>

Take a look at conditional types, especially the [`infer`](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types) keyword,
</details>

## `sequence.zip`
TODO
