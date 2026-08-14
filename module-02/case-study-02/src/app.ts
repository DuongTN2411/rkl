import "./styles.css";
import * as storage from "./storage";
import { initUi } from "./ui";

storage.seedIfEmpty();
initUi();