class SyntaxHighlighterManager {
    /**
     * Initialise le surlignage en appliquant la méthode highlight
     * à tous les éléments du DOM qui ont l'attribut data-type="code"
     */
    init() {
        this.copyCodeInBlockCode();
        document.querySelectorAll('[data-type="code"]').forEach(element => {
            this.highlight(element);
        });
    }
    ;
    /**
     * Méthode principale qui transforme le contenu HTML d'un élément
     * en ajoutant des styles pour colorer syntaxiquement le code HTML
     * @param element Élément DOM à surligner
     */
    highlight(element) {
        let html = element.innerHTML;
        // Étape 1 : échapper les caractères spéciaux pour éviter l'interprétation HTML
        html = this.escapeHTML(html);
        // Étape 2 : colorer les commentaires HTML
        html = this.colorComments(html);
        // Étape 3 : colorer le texte
        html = this.colorText(html);
        // Étape 4 : colorer les balises, leurs noms et attributs
        html = this.colorTags(html);
        // Remplacer le contenu initial par le contenu coloré
        element.innerHTML = html;
    }
    ;
    /**
     * Échappe les caractères spéciaux HTML
     * @param text texte à échapper
     * @returns texte échappé
     */
    escapeHTML(text) {
        return text
            // .replace(/&/g, "&amp;")  // décommenter si besoin mais attention à double échapper
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    ;
    /**
     * Colorie les commentaires HTML (ex : <!-- commentaire -->)
     * @param text texte contenant potentiellement des commentaires
     * @returns texte avec commentaires colorés
     */
    colorComments(text) {
        return text.replace(/(&lt;!--[\s\S]*?--&gt;)/g, match => `<span class="${SyntaxHighlighterManager.class.comment}">${match}</span>`);
    }
    ;
    /**
     * Colorie les balises HTML, leur nom et leurs attributs
     * @param text texte contenant des balises HTML échappées
     * @returns texte avec balises colorées
     */
    colorTags(text) {
        return text.replace(/(&lt;\/?)([a-zA-Z0-9\-]+)([\s\S]*?)(\/?)(&gt;)/g, (match, p1, tagName, attrs, selfClosing, p5) => {
            let tagStart = `<span class="${SyntaxHighlighterManager.class.tag}">${p1}</span>`;
            let tagNameColored = `<span class="${SyntaxHighlighterManager.class.tagName}">${tagName}</span>`;
            let attrsColored = this.colorAttributes(attrs);
            let selfClosingColored = selfClosing ? `<span class="${SyntaxHighlighterManager.class.tag}">${selfClosing}</span>` : '';
            let tagEnd = `<span class="${SyntaxHighlighterManager.class.tag}">${p5}</span>`;
            return tagStart + tagNameColored + attrsColored + selfClosingColored + tagEnd;
        });
    }
    ;
    /**
     * Colorie les attributs dans la chaîne d'attributs
     * @param attrs chaîne brute des attributs
     * @returns attributs colorés
     */
    colorAttributes(attrs) {
        return attrs.replace(/(\s+)([a-zA-Z\-:]+)(=)("([^"]*)"|'([^']*)')?/g, (match, spaces, attrName, equalSign, quotedValue) => {
            let colored = spaces;
            colored += `<span class="${SyntaxHighlighterManager.class.attributeName}">${attrName}</span>`;
            colored += `<span class="${SyntaxHighlighterManager.class.equalSign}">${equalSign}</span>`;
            if (quotedValue) {
                colored += `<span class="${SyntaxHighlighterManager.class.attributeValue}">${quotedValue}</span>`;
            }
            return colored;
        });
    }
    ;
    /**
     * Colorie le texte entre balises HTML (échappé)
     * @param text texte contenant du HTML échappé
     * @returns texte avec texte coloré
     */
    colorText(text) {
        return text.replace(/(&gt;)([^&]+?)(&lt;)/g, (match, p1, content, p3) => {
            if (!content.trim())
                return match;
            // Éviter de colorer si c'est un commentaire
            if (p3 === '&lt;' && text.substr(text.indexOf(match) + match.length - 4, 7) === '&lt;!--') {
                return match;
            }
            return `${p1}<span class="${SyntaxHighlighterManager.class.text}">${content}</span>${p3}`;
        });
    }
    ;
    /**
     * Copie le contenu des éléments référencés par data-code-target
     * @returns void
     */
    copyCodeInBlockCode() {
        document.querySelectorAll('[data-code-target]').forEach(element => {
            const targetSelector = element.getAttribute('data-code-target');
            if (!targetSelector)
                return;
            const target = document.querySelector(targetSelector);
            if (!target)
                return;
            target.innerHTML = element.innerHTML;
        });
    }
    ;
}
// Couleurs utilisées pour chaque type de token HTML
SyntaxHighlighterManager.class = {
    tag: "highlight-tag", // Les chevrons < et > et le nom des balises
    tagName: "highlight-tag-name", // Le nom des balises
    attributeName: "highlight-attribute-name", // Les noms d'attributs
    attributeValue: "highlight-attribute-value", // Les valeurs d'attributs (entre guillemets)
    comment: "highlight-comment", // Les commentaires HTML
    equalSign: "highlight-equal-sign", // Le signe égal '=' dans les attributs
    text: "highlight-text", // Le texte de base
};
export default SyntaxHighlighterManager;
