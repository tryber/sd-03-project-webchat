class Container {
  constructor(init, dependencies) {
    Object.entries(dependencies).forEach(([name, value]) => {
      this[name] = value;
    });
    this.startCb = init.start;
    this.params = init.params;
  }

  callInjection(type) { // para uma funcao que retorna o objeto modulo
    this[type].object = this[type].object(...this.getParams(type));
  }

  getParams(type) {
    const { params } = this[type];
    return params.map((param) => this[param].object);
  }

  populate(objFunctions, type) {
    return Object.entries(objFunctions).reduce((newObj, [functionName, func]) => ({
      [functionName]: func(...this.getParams(type)),
      ...newObj,
    }), {});
  }

  injectOn(type) { // para um objeto modulo de itens funcao que retornam objeto
    this[type].object = Object.entries(this[type].object)
      .reduce((newObject, [itemName, objFunctions]) => ({
        [itemName]: this.populate(objFunctions, 'controllers'),
        ...newObject,
      }), {});
  }

  start() {
    console.log('chegou ak');
    const params = this.params.map((param) => this[param].object);
    this.startCb(...params);
  }
}

module.exports = Container;
