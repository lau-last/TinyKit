import NavbarManager from './js/navbar.js';
import NavbarSideManager from './js/navbar_side.js';
import BurgerManager from './js/burger.js';
import TabsManager from './js/tab.js';
import ModalManager from './js/modal.js';
import DropdownManager from './js/dropdown.js';
import ThemeManager from './js/theme.js';
import InputManager from './js/input.js';
import CopyToClipboardManager from './js/clipboard.js';
import SyntaxHighlighterManager from './js/highlighter.js';
import ToggleManager from './js/toggle.js';
import SettingManager  from "./js/setting.js";
import AlertManager from "./js/alert.js";
import ScrollIndicatorManager from "./js/scroll_indicator.js";
import AnimationManager from "./js/animation.js";
import KeepScrollViewManager from "./js/keep_scroll_view.js";



const navbar = new NavbarManager();
const navbarSide = new NavbarSideManager();
const burger = new BurgerManager();
const tabs = new TabsManager();
const modal = new ModalManager();
const dropdown = new DropdownManager();
const theme = new ThemeManager();
const input = new InputManager();
const copyToClipboard = new CopyToClipboardManager();
const syntaxHighlighter = new SyntaxHighlighterManager();
const toggle = new ToggleManager();
const setting = new SettingManager();
const alert = new AlertManager();
const scrollIndicator = new ScrollIndicatorManager();
const animation = new AnimationManager();
const keepScrollView = new KeepScrollViewManager();



document.addEventListener('DOMContentLoaded', function () {
    navbar.init();
    navbarSide.init();
    burger.init();
    tabs.init();
    modal.init();
    dropdown.init();
    theme.init();
    input.init();
    copyToClipboard.init();
    syntaxHighlighter.init();
    toggle.init();
    setting.init();
    alert.init();
    scrollIndicator.init();
    animation.init();
    keepScrollView.init();
});
