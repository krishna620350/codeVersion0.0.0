class HeaderCheck {
    #header = {};
    #missingHeader = {};

    postHeaderCheck = (header) => {
        this.#header = header;
        this.#missingHeader = {}; // Reset missingHeader for each call

        if (this.#header['content-type'] !== 'application/json') {
            this.#missingHeader['content-type'] = 'application/json';
        }

        return Object.keys(this.#missingHeader).length > 0
            ? this.#missingHeader
            : true;
    };
}

export default new HeaderCheck(); // Use ES6 module export
