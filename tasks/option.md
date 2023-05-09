# Option
The goal is to implement the type `Option<T>`. It represents a a value of type `T` that is "optional" (might not exist).  
`Option` has two variants.
- `Some` for the case the value exist. Containing "some" value of type `T`.
- `None` for the case the value doesn't exist.

Your solution should go [here](/src/option.ts). There are also [unit tests](/test/option.spec.ts) and [sample solutions](/src/option.solution.ts).

## `Option.some` and `Option.none`
Create two free functions
 - `Option.some` taking any value and returning an `Option` instance holding that value. The returned value should have a `value` field containing the passed value and a `hasValue` field set to `true`.
 - `Option.none` taking no argument and returning an `Option` instance holding no value. The returned value should have a `hasValue` field set to `false`.

<details>
<summary>Hint 1</summary>

Define two different classes, one for each variant.
</details>

<details>
<summary>Hint 2</summary>

Define the `Option` type as the union of both variants.
</details>

<details>
<summary>Hint 3</summary>

Build the variants in such a way that `Maybe` becomes a [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions). 
</details>

<details>
<summary>Hint 4</summary>

Ensure that the field `hasValue` has the *type* `true` in the `Some` class and the *type* `false` in the `None` class.
</details>

<details>
<summary>Hint 5</summary>

```ts
some<T>(t: T): Option<T>
none<T>(): Option<T>
```
</details>


<ins>**Challenge:**</ins> implement the `None` variant as a singleton without casting i.e. always the same instance is returned, regardless of the type the wrapped value has.

<details>
<summary>Challenge hint 1</summary>

Take a look at the `never` type in typescript.
</details>

## `Option.fromNullable`
Write a free function that takes a value that might be `null` or `undefined`. If the value was `null | undefined` than `None` is returned, otherwise the value is wrapped in a `Some`.
The return type should reflect that the `Option` can't contain `null | undefined`.

<details>
<summary>Hint 1</summary>

Typescript has a built in utility type `NonNullable`.
</details>

<details>
<summary>Hint 2</summary>

```ts
fromNullable<T>(nullishValue: T): Option<NonNullable<T>>
```
</details>

## `option.unwrapOr`
Write a method `unwrapOr` that takes a default value that is returned if `option` is `None`. If `option` is `Some` the wrapped is value simply returned.
`unwrapOr` should allow for widening the type. Meaning the type of the default value can differ from the wrapped type.

<details>
<summary>Hint 1</summary>

`unwrapOr` must introduce e new type for the Default value.
</details>

<details>
<summary>Hint 2</summary>

The return type is the union of the wrapped type and the type of the default value.
</details>

<details>
<summary>Hint 3</summary>

```ts
unwrapOr<U>(defaultValue: U): T | U
```
</details>

## `option.map`

Write a method `map` that takes a function `mapper` and uses it to transform the wrapped value of the `Option`.

<details>
<summary>Hint 1</summary>

If the `Option` is `None` then `map` does nothing.
</details>

<details>
<summary>Hint 2</summary>

If the `Option` is `Some` then `map` calls the `mapper` function with the value of the option and returns the resulting value wrapped in a new `Some`.
</details>

<details>
<summary>Hint 3</summary>

`map` must introduce a new type. The `mapper` function takes a value of the wrapped type of the `Option` and returns the new type.
</details>

<details>
<summary>Hint 4</summary>

```ts
map<U>(mapper: (value:T) => U): Option<U>
```
</details>

## `option.flatMap`

Write a method `flatMap` that takes a function `mapper` and uses it to transform the wrapped value. The `mapper` function should return an `Option` instance but the returned value of `flatMap` shall be flat i.e. not be a nested `Option`.


<details>
<summary>Hint 1</summary>

If the `Option` is `None` then `flatMap` does nothing.
</details>

<details>
<summary>Hint 2</summary>

If the `Option` is `Some` then `flatMap` calls the `mapper` function with the value of the option and returns the result.
</details>

<details>
<summary>Hint 3</summary>

`flatMap` must introduce a new type. The `mapper` function takes a value of the wrapped type of the `Option` and returns an `Option` of the new type.
</details>

<details>
<summary>Hint 4</summary>

```ts
flatMap<U>(mapper: (value:T) => Option<U>): Option<U>
```
</details>

## `Option.flatten`

Write a free function `flatten` that takes an `Option` containing an `Option` and flattens it i.e. returns the nested `Option`.


<details>
<summary>Hint 1</summary>

If the `Option` is `None` then `Option.flatten` does nothing.
</details>

<details>
<summary>Hint 2</summary>

If the `Option` is `Some` then `Option.flatten` simply returns the wrapped value.
</details>

<details>
<summary>Hint 3</summary>

`Option.flatten` must introduce a new type that describes the value wrapped by two `Options`.
</details>

<details>
<summary>Hint 4</summary>

```ts
flatten<T>(option: Option<Option<T>>): Option<T>
```
</details>

<ins>**Challenge 1:**</ins> implement it only using `flatMap`.

<details>
<summary>Challenge hint 1.1</summary>

`flatMap` already has a "flattening" behavior. Let the `flatMap` do nothing.
</details>

<ins>**Challenge 2:**</ins> also implement a method named `flatten` that does the same. `option.flatten` should only be callable if `option` is known to container another `Option`.

<details>
<summary>Challenge hint 2.1</summary>

Take a look at [this parameters](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-parameters). They allow you to specify in which context a method is allowed to be called.
</details>
