import { Schema } from "@colyseus/schema";

import {
    World as EcsyWorld,
    Component as EcsyComponent,
    System,
    TagComponent,
    Types,
} from "ecsy";

import { applyMixins } from "./utils";
import { TYPE_MAP } from "./types";

// Combine Schema + EcsyComponent
export interface Component<C=any> extends Schema, EcsyComponent<C> {};
export class Component<C> {
    static schema: any;
    static isComponent: true;
}
applyMixins(Component, [EcsyComponent, Schema]);

export class World extends EcsyWorld {
    // @ts-ignore
    registerComponent(...args: any[]) {
        const ecsySchema = {};
        const schema = args[0]._definition?.schema || {};

        for (const field in schema) {
            const schemaType = schema[field];

            let type: any;

            switch (typeof(schemaType)) {
                case "string":
                    type = TYPE_MAP[schemaType];
                    break;

                case "function":
                    type = Types.Ref;
                    break;

                case "object":
                    type = (Array.isArray(schemaType))
                        ? Types.Array
                        : Types.JSON;
                    break;
            }

            ecsySchema[field] = { type };
        }

        args[0].schema = ecsySchema;

        // @ts-ignore
        return super.registerComponent(...args);
    }
}

export { System, TagComponent};