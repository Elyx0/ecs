import {
    CanvasContext,
    Circle,
    DemoSettings,
    Intersecting,
    Movement,
    State,
} from "@shared/components/components";
import { TagComponent as ClientTagComponent, Not } from "ecsy";
import { System, World } from "@colyseus/ecs";

import { Client } from "colyseus.js";
import { getRendererSystem } from "./systems";

const client = new Client("ws://localhost:2567");

// class Hover extends ClientTagComponent {}
// class HoverSystem extends System {
//     static queries = {
//         entities: { components: [Circle] },
//     };
//     execute() {}
// }

document.addEventListener("DOMContentLoaded", async () => {
    const ctx = document.querySelector("canvas").getContext("2d");
    const world = new World();

    const rendererSystem = getRendererSystem(ctx);

    world
        .registerComponent(Circle)
        .registerComponent(Movement)
        .registerComponent(Intersecting)
        .registerComponent(CanvasContext)
        .registerComponent(DemoSettings)
        // .registerComponent(Hover)
        // .registerSystem(HoverSystem)
        .registerSystem(rendererSystem);

    // connect to colyseus' room
    const room = await client.joinOrCreate("my_room", {}, State);
    world.useEntities(room.state.entities);

    let previousTime = Date.now();
    room.onStateChange(() => {
        console.log("STATE CHANGE!");
        const now = Date.now();
        world.execute(now - previousTime);
        previousTime = now;
    });
});
