const { readdirSync } = require('fs');
const express = require('express');
const { resolve: resolvePath, sep } = require('path')

class Routes {
    /**
     * 
     * @param {string} path Routes path
     * @param {express.Express} server Server to assign routes
     */

    constructor(path, server) {
        this.server = server;

        const routes = readdirSync(path, { withFileTypes: true }).filter(dirent => dirent.isDirectory())

        this.__routes = routes.map(route => {
            // console.log(resolvePath(path + sep + route.name))
            let routeData = {
                path: resolvePath(path + sep + route.name),
                name: route.name == "index" ? "" : route.name.replace(".", "/")
            }

            return routeData;
        })
        
        for (const route of this.__routes) this.createRoute(route)
    }

    createRoute(route) {
        this.server.get("/" + route.name, (req, res) => {
            res.sendFile(route.path + "/index.html")
        })
    }
}

module.exports = Routes