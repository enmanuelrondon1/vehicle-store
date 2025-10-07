"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//scripts/migrate-user-ids.ts
var mongodb_1 = require("mongodb");
// Extraído de tu archivo .env.local
var MONGODB_URI = "mongodb+srv://designdevproenmanuel:Admin123*@cluster0.su62xsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DB_NAME = 'vehicle_store';
var COLLECTION_NAME = 'vehicles';
function migrateUserIds() {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, collection, query, documentsToUpdate, bulkOps, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Iniciando script de migración...');
                    client = new mongodb_1.MongoClient(MONGODB_URI);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 8]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    console.log('Conectado a la base de datos MongoDB.');
                    db = client.db(DB_NAME);
                    collection = db.collection(COLLECTION_NAME);
                    query = { 'sellerContact.userId': { $type: 'objectId' } };
                    return [4 /*yield*/, collection.find(query).toArray()];
                case 3:
                    documentsToUpdate = _a.sent();
                    if (documentsToUpdate.length === 0) {
                        console.log('No se encontraron anuncios con el formato de ID antiguo. ¡No se necesita migración!');
                        return [2 /*return*/];
                    }
                    console.log("Se encontraron ".concat(documentsToUpdate.length, " anuncios para actualizar."));
                    bulkOps = documentsToUpdate.map(function (doc) {
                        var newUserId = doc.sellerContact.userId.toHexString();
                        console.log("- Actualizando anuncio ".concat(doc._id, ": ID de usuario ").concat(doc.sellerContact.userId, " -> ").concat(newUserId));
                        return {
                            updateOne: {
                                filter: { _id: doc._id },
                                update: { $set: { 'sellerContact.userId': newUserId } }
                            }
                        };
                    });
                    return [4 /*yield*/, collection.bulkWrite(bulkOps)];
                case 4:
                    result = _a.sent();
                    console.log('\n¡Migración completada con éxito!');
                    console.log("- Documentos buscados: ".concat(result.matchedCount));
                    console.log("- Documentos actualizados: ".concat(result.modifiedCount));
                    return [3 /*break*/, 8];
                case 5:
                    error_1 = _a.sent();
                    console.error('Ocurrió un error durante la migración:', error_1);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, client.close()];
                case 7:
                    _a.sent();
                    console.log('Conexión con la base de datos cerrada.');
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
migrateUserIds();
