import NavbarManager from './js/navbar.js';
import NavbarSideManager from './js/navbar_side.js';
import BurgerManager from './js/burger.js';
import TabsManager from './js/tab.js';
import ModalManager from './js/modal.js';
import DropdownManager from './js/dropdown.js';
import CarouselFadeManager from './js/carousel_fade.js';
import ThemeManager from './js/theme.js';
import InputManager from './js/input.js';
import CopyToClipboardManager from './js/clipboard.js';
import SyntaxHighlighterManager from './js/highlighter.js';
import ToggleManager from './js/toggle.js';
import SettingManager  from "./js/setting.js";
import AlertManager from "./js/alert.js";


const navbar = new NavbarManager();
const navbarSide = new NavbarSideManager();
const burger = new BurgerManager();
const tabs = new TabsManager();
const modal = new ModalManager();
const carouselFade = new CarouselFadeManager();
const dropdown = new DropdownManager();
const theme = new ThemeManager();
const input = new InputManager();
const copyToClipboard = new CopyToClipboardManager();
const syntaxHighlighter = new SyntaxHighlighterManager();
const toggle = new ToggleManager();
const setting = new SettingManager();
const alert = new AlertManager();

document.addEventListener('DOMContentLoaded', function () {
    navbar.init();
    navbarSide.init();
    burger.init();
    tabs.init();
    modal.init();
    dropdown.init();
    carouselFade.init();
    theme.init();
    input.init();
    copyToClipboard.init();
    syntaxHighlighter.init();
    toggle.init();
    setting.init();
    alert.init();
});
