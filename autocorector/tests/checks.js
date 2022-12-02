/* eslint-disable no-invalid-this*/
/* eslint-disable no-undef*/
// IMPORTS
const path = require("path");
const Utils = require("../utils/testutils");
const fs = require("fs");
const User = require('../../user.json');

const path_assignment = path.resolve(path.join(__dirname, "../../", "banda.json"));
const path_assignment2 = path.resolve(path.join(__dirname, "../../", "banda.schema.json"));

// CRITICAL ERRORS
let error_critical = null;

const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
addFormats(ajv);

//variable para leer el fichero json y procesarlo solo una vez, cuando se que existe y tiene formato JSON válido
let banda;
//variable para leer el esquema json y procesarlo solo una vez, cuando se que existe y tiene formato JSON válido
let bandaschema;

// TESTS
describe("JSON Tests:", function () {
    it("1(Precheck): Comprobando que existen los ficheros de la entrega...", async function () {
        this.name = "";
        this.score = 0;
        this.msg_ok = `Encontrados los ficheros '${path_assignment}' y '${path_assignment2}'`;
        this.msg_err = `No se encontró el fichero '${path_assignment}'`;
        const fileexists = await Utils.checkFileExists(path_assignment);
        if (!fileexists) {
            error_critical = this.msg_err;
        }
        fileexists.should.be.equal(true);
        this.msg_err = `No se encontró el fichero '${path_assignment2}'`;
        const fileexists2 = await Utils.checkFileExists(path_assignment2);
        if (!fileexists2) {
            error_critical = this.msg_err;
        }
        fileexists.should.be.equal(true);
    });

    it("2: Comprobando que el fichero principal contiene JSON con formato correcto.", async function () {
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El fichero contiene JSON con formato correcto.";
            this.msg_err = `El fichero ${path_assignment} no contiene JSON válido.`;
            const data = fs.readFileSync(path_assignment, 'utf8');
            let isJSON = Utils.isJSON(data);
            isJSON.should.be.equal(true);
            if(!isJSON){
                error_critical = `El fichero ${path_assignment} no contiene JSON válido.`;
            } else {
                banda = JSON.parse(fs.readFileSync(path_assignment, 'utf8'));
            }
        }
    });

    it("3: Comprobando que el schema contiene JSON con formato correcto.", async function () {
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema contiene JSON con formato correcto.";
            this.msg_err = `El fichero ${path_assignment2} no contiene JSON válido.`;
            const data = fs.readFileSync(path_assignment2, 'utf8');
            let isJSON = Utils.isJSON(data);
            isJSON.should.be.equal(true);
            if(!isJSON){
                error_critical = `El fichero ${path_assignment2} no contiene JSON válido.`;
            } else {
                bandaschema = JSON.parse(fs.readFileSync(path_assignment2, 'utf8'));
            }
        }
    });

    it("4: Comprobando que el JSON tiene los campos requeridos.", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El fichero contiene los campos mínimos solicitados en el enunciado.";
            this.msg_err = `El fichero no contiene los campos mínimos solicitados en el enunciado.`;
            const schema = {
                type: "object",
                required: [ "group", "foundation_year", "web", "email", "description", "members", "albums", "concerts" ]
            }
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("5: Comprobando email.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Email es correcto.";
            this.msg_err = `Email NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "email"],
                properties: {                    
                    "email": {
                      "type": "string",
                      "format": "email"
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
            User.email.should.be.equal(banda.email);
        }
    });

    it("6: Comprobando foundation_year.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Foundation_year es correcto.";
            this.msg_err = `Foundation_year NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "foundation_year"],
                properties: {                    
                    "foundation_year": {
                        "type": "string",
                        "format": "date"
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });


    it("7: Comprobando que el array members es correcto.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El array members es correcto.";
            this.msg_err = `El array members NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "members"],
                properties: {                    
                    "members": {
                      "type": "array",
                      "uniqueItems": true, 
                      "items": {
                        "type": "object"
                      },
                      "minItems": 2,
                      "maxItems": 10
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("8: Comprobando que el array albums es correcto.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El array albums es correcto.";
            this.msg_err = `El array albums NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "albums"],
                properties: {                    
                    "albums": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "type": "object",
                        "required": ["name", "year", "songs"]                        
                      }
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("9: Comprobando que el array concerts es correcto.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El array concerts es correcto.";
            this.msg_err = `El array concerts NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "concerts"],
                properties: {                    
                    "concerts": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "type": "string"
                      }
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("10: Comprobando el schema. Tiene la propiedad required.", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema es tiene required.";
            this.msg_err = `El schema NO tiene required o no es correcto.`;
            const schema = {
                type: "object",
                required: [ "required"],
                properties: {                    
                    "required": {
                      "type": "array",
                      "minItems": 8,
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("11: Comprobando el schema. Tiene el resto de atributos.", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema tiene el resto de atributos.";
            this.msg_err = `El schema NO tiene el resto de atributos.`;
            const schema = {
                type: "object",
                required: [ "required", "properties", "$id", "$schema", "type"],
                properties: {                    
                    "properties": {
                      "type": "object",
                      required: [ "group", "foundation_year", "web", "email", "description", "members", "albums", "concerts" ]
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("12: Comprobando el schema. Valida el campo group que es un string con su tamaño adecuado.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo group bien.";
            this.msg_err = "El schema NO valida el campo group bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "group" ],
                      properties: {  
                        "group": {
                            type: "object",
                            required: [ "type", "minLength", "maxLength" ],
                            properties: {
                                "type": {
                                    type: "string"
                                },
                                "minLength": {
                                    "const": 3
                                },
                                "maxLength": {
                                    "const": 50
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("13: Comprobando el schema. Valida el campo foundation_year que es un string con una fecha.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo foundation_year bien.";
            this.msg_err = "El schema NO valida el campo foundation_year bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "foundation_year" ],
                      properties: {  
                        "foundation_year": {
                            type: "object",
                            required: [ "type", "format" ],
                            properties: {
                                "type": {
                                    type: "string"
                                },
                                "format": {
                                    "const": "date"
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("14: Comprobando el schema. Valida el campo web que es un string con una URI.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo web bien.";
            this.msg_err = "El schema NO valida el campo web bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "web" ],
                      properties: {  
                        "web": {
                            type: "object",
                            required: [ "type", "format" ],
                            properties: {
                                "type": {
                                    type: "string"
                                },
                                "format": {
                                    "const": "uri"
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("15: Comprobando el schema. Valida el campo email que es un string con un email válido.", async function () {
        this.score = 0.2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo email bien.";
            this.msg_err = "El schema NO valida el campo email bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "email" ],
                      properties: {  
                        "email": {
                            type: "object",
                            required: [ "type", "format" ],
                            properties: {
                                "type": {
                                    type: "string"
                                },
                                "format": {
                                    "const": "email"
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("16: Comprobando el schema. Valida el campo description que es un string con su tamaño adecuado.", async function () {
        this.score = 0.3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo description bien.";
            this.msg_err = "El schema NO valida el campo description bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "description" ],
                      properties: {  
                        "description": {
                            type: "object",
                            required: [ "type", "minLength", "maxLength" ],
                            properties: {
                                "type": {
                                    type: "string"
                                },
                                "minLength": {
                                    "const": 50
                                },
                                "maxLength": {
                                    "const": 500
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("17: Comprobando el schema. Valida el campo members.", async function () {
        this.score = 0.3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo members bien.";
            this.msg_err = "El schema NO valida el campo members bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "members" ],
                      properties: {  
                        "members": {
                            type: "object",
                            required: [ "type", "minItems", "maxItems", "uniqueItems", "items" ],
                            properties: {
                                "type": {
                                    "const": "array"
                                },
                                "minItems": {
                                    "const": 2
                                },
                                "maxItems": {
                                    "const": 10
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("18: Comprobando el schema. Valida el campo albums.", async function () {
        this.score = 0.3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo albums bien.";
            this.msg_err = "El schema NO valida el campo albums bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "albums" ],
                      properties: {  
                        "albums": {
                            type: "object",
                            required: [ "type", "minItems", "uniqueItems", "items" ],
                            properties: {
                                "type": {
                                    "const": "array"
                                },
                                "minItems": {
                                    "const": 1
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("19: Comprobando el schema. Valida el campo concerts.", async function () {
        this.score = 0.3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema valida el campo concerts bien.";
            this.msg_err = "El schema NO valida el campo concerts bien.";
            const schema = {
                type: "object",
                required: [ "properties" ],
                properties: {                    
                    "properties": {
                      type: "object",
                      required: [ "concerts" ],
                      properties: {  
                        "concerts": {
                            type: "object",
                            required: [ "type", "minItems", "uniqueItems", "items" ],
                            properties: {
                                "type": {
                                    "const": "array"
                                },
                                "minItems": {
                                    "const": 1
                                }
                            }
                        }
                      }
                    }
                }
            }
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("12: Aplicando el esquema al json.", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El json desarrollado valida con el schema implementado.";
            this.msg_err = "El json desarrollado NO valida con el schema implementado.";
            
            const validate = ajv.compile(bandaschema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

});
