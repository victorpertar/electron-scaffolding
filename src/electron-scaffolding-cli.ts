#! /usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as spawn from 'child_process';

namespace electronScaffolding {

    interface ApplicationBuilder {
        build (): void;
    }

    export interface ApplicationProperties {
        name : string;
        main : string,
        version: string;
        devDependencies: {};
    }

    export class ElectronApplicationBuilder implements ApplicationBuilder {

        private electronAppProps : ApplicationProperties;

        constructor(electronAppProps : ApplicationProperties) {
            this.electronAppProps = electronAppProps;
        }

        build () : void {

            // build the default electron project.

            let resolvedBuildDir = path.resolve(".");
            const projectDir = resolvedBuildDir + "/" + electronAppProps.name;

            // generate default folder structure
            fs.mkdirSync(projectDir);
            fs.mkdirSync(projectDir + "/app");

            // generate default package.json
            this.generateFile(projectDir, "package.json", JSON.stringify(electronAppProps));

            // generate default index.html
            this.generateFile(projectDir, "index.html", fs.readFileSync("src/resources/template.index.html", null));

            // generate default index.js
            this.generateFile(projectDir, "index.js", fs.readFileSync("src/resources/template.index.js", null));

            //run npm install
            spawn.execSync("npm install --save-dev", {
                cwd: projectDir
            });

            //run .node_modules/.bin/electron .
            spawn.execSync(".\\node_modules\\.bin\\electron ." , {
                cwd: projectDir
            });
        }

        private generateFile(dir: string, filename : string, content: string): void {
            fs.writeFileSync(dir + "/" + filename, content);
        }

    }

}

const electronAppProps : electronScaffolding.ApplicationProperties = {
    name: "myElectronProject",
    version: "1.0.0",
    main: "index.js",
    devDependencies: {
        "electron-prebuilt": "*"
    }
};

new electronScaffolding.ElectronApplicationBuilder(electronAppProps).build();