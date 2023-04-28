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

Define the `Option` type as the union of both the variants.
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

Write a function map that takes a function f and uses it to transform the wrapped value of the.

## `flatMap`

Write a function flatMap that takes a function f and uses it to transform the wrapped value. The function f should return an maybe but the returns falue of flatMap shall be flat i.e. not be a nested Maybe

Write a function flatten that takes a Maybe containing a maybe and unwraps it i.e. returns the nested maybe
Challenge: implement it only using flatMap
