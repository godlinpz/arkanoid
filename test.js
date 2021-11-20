class T {
    #t = 1;

    constructor(t1)
    {
        const _ = this;
        _.#t = t1;
    }

    test()
    {
        const _ = this;

        console.log(_.#t);
    }

    get t() { return this.#t; }
    set t(val) { this.#t = val; console.log('SETTER'); }
}

const t = new T(2);
t.test();
t.t = 4;
console.log(t.t);