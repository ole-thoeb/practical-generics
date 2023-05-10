class Some<T> {
    readonly hasValue = true
    constructor(readonly value: T) { }

    unwrapOr(): T {
        return this.value
    }

    map<U>(mapper: (t: T) => U): Option<U> {
        return Option.some(mapper(this.value))
    }

    flatMap<U>(mapper: (t: T) => Option<U>): Option<U> {
        return mapper(this.value)
    }

    flatten<U>(this: Option<Option<U>>): Option<U> {
        // `this` type can't be `Some<Option<U>>` otherwise `flatten` is not callable on any `Option`,
        // therefore we need to check here, even though we know we have a `Some`.
        // Could also be solved with a cast.
        if (this.hasValue) {
            return this.value
        }
        return Option.none()
    }
}

class None {
    readonly hasValue = false

    unwrapOr<U>(defaultValue: U): U {
        return defaultValue
    }

    map<U>(): Option<U> {
        return this
    }

    flatMap<U>(): Option<U> {
        return this
    }

    flatten(): Option<never> {
        return this
    }
}

const NONE_INSTANCE = new None()

export type Option<T> = Some<T> | None

export const Option = {
    some<T>(value: T): Option<T> {
        return new Some(value)
    },
    none(): Option<never> {
        return NONE_INSTANCE
    },
    fromNullable<T>(nullishValue: T): Option<NonNullable<T>> {
        if (nullishValue == null) {
            return Option.none()
        }
        return Option.some(nullishValue)
    },
    flatten<T>(option: Option<Option<T>>): Option<T> {
        return option.flatMap(x => x)
    }
}