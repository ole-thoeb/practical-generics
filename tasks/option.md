# Option
The goal is to implement the type `Option<T>`. It represents a a value of type `T` that is "optional" (might not exist).  
`Option` has two variants.
- `Some` for the case the value exist. Containing "some" value of type `T`.
- `None` for the case the value doesn't exist.

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


<u>**Challenge:**</u> implement the `None` variant as a singleton without casting i.e. always the same instance is returned, regardless of the type the wrapped value has.

<details>
<summary>Challenge hint 1</summary>

Take a look at the `never` type in typescript.
</details>

## `map`

Write an instance function `map` that takes a function `mapper` and uses it to transform the wrapped value of the `Option`.

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
map<U>(mapper: (value:T) => U): Option<T>
```
</details>

## `flatMap`

Write an instance function `flatMap` that takes a function `mapper` and uses it to transform the wrapped value. The `mapper` function should return an `Option` but the returned value of `flatMap` shall be flat i.e. not be a nested `Option`.

## `Option.flatten`

Write a free function `flatten` that takes an `Option` containing an `Option` and flatens it i.e. returns the nested Option.
**Challenge:** implement it only using flatMap
