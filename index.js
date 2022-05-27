// save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
// getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
// getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
// deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
// deleteAll(): void - Elimina todos los objetos presentes en el archivo.

const fs = require('fs');
const express = require('express')
const app = express();
const PORT = 8080;
console.clear();


class Contenedor {

    static id = 0;
    productos = [];

    constructor(fileName) {
        this.fileName = fileName
    }

    async save(producto) {
        Contenedor.id++;
        producto.id = Contenedor.id;

        this.productos.push(producto);
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(this.productos, null, 2));
        } catch (err) {
            console.log(err);
        }
        return Contenedor.id;
    }

    async getById(id) {

        try {
            const products = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            const result = products.find(e => e.id === id);

            if (result === undefined) {
                console.log("El ID ingresado no corresponde a un producto")
            } else {
                console.log(result);
                return result;
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAll() {
        try {
            const productList = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            console.log(productList);
            return productList;
        } catch (err) {
            console.log(err);
        }
    }
    async deleteById(id) {
        try {
            const products = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            const deleteId = products.find(e => e.id === id);
            const result = products.filter(e => e.id != deleteId.id)
            Contenedor.productos = result;
            await fs.promises.writeFile(this.fileName, JSON.stringify(Contenedor.productos, null, 2));
        } catch (err) {
            console.log(err);
        }
    }
    async deleteAll() {
        Contenedor.productos = [];
        await fs.promises.writeFile(this.fileName, JSON.stringify(Contenedor.productos, null, 2));
    }
    async getRandom() {
        const products = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
        const randomElement = products[Math.floor(Math.random() * products.length)];
        console.log(randomElement);
        return randomElement;
    }
}

const producto1 = {
    nombre: "monitor",
    price: 1000,
    thumbnail: "foto"
}

const producto2 = {
    nombre: "pc",
    price: 21000,
    thumbnail: "foto"
}

const products = new Contenedor('productos.txt');

// products.save(producto1);
// products.save(producto2);
// products.save(producto1);

//products.getById(1);
// products.getAll();
//products.deleteById(1);
//products.deleteAll();


app.get('/productos', async (req, res) => {
    let list = await products.getAll()
    res.send(list);
})

app.get('/productoRandom', async (req, res) => {
    let product = await products.getRandom();
    res.send(product);
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server runing on Port:${PORT}`);
})