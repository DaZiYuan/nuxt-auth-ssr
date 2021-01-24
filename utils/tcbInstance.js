import cloudbase from "@cloudbase/js-sdk";
let app = null;
let auth = null;
let db = null;

if (!process.server) {
    app = cloudbase.init({
        env: "test-livewallpaper-5dbri89faad9b"
    });
    auth = app.auth({ persistence: "local" });
    db = app.database();
}

export { app, auth, db };
