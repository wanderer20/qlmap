import WorldMap from '../maps/world-map.svg'
import WorldMapWithAntarctica from '../maps/world-map-with-antarctica.svg'
import { createElementFromHTML, mergeDeep } from '../util/tools'

/**
 * QLMap
 */
export class QLMap {
    /**
     * Конструктор
     * @param elem
     * @param options
     */
    constructor(elem, options = {}) {
        this.root = elem
        this.settings = mergeDeep(
            {
                map:                        "world",
                customMap:                  false,
                territories:                true,
                antarctica:                 false,
                style: {
                    colors: {
                        primary: '#eee',
                        background: '#e8e8e8',
                        border: '#fff',
                        hoverPrimary: 'yellow',
                        hoverBorder: '#fff',
                        selectedPrimary: '#ff7395',
                        selectedBorder: '#fff',
                        selectedHoverPrimary: '#ff55b8',
                        selectedHoverBorder: '#fff'
                    },
                    border: {
                        width: '2'
                    }
                },
                selectedCountries: [],
                events: {
                    click: (e) => {
                        try {
                            if (options.on['click']) options.on['click'](e)
                        } catch (e) {

                        }
                    },
                    hover: (e) => {
                        try {
                            if (this.map) {
                                const contour = this.map.getElementById(e.target.getAttribute('id'))

                                let mapElements = []

                                mapElements = mapElements.concat(Array.prototype.slice.call(contour.getElementsByTagName('path')))
                                mapElements = mapElements.concat(Array.prototype.slice.call(contour.getElementsByTagName('rect')))

                                for (let i = 0; i < mapElements.length; i++) {
                                    const eventType = this.settings.selectedCountries.includes(mapElements[i].getAttribute('id')) ? 'selected hover' : 'hover'
                                    this.changeCountryColorScheme(mapElements[i], eventType)
                                }

                                if (options.on['hover']) options.on['hover'](e)
                            }
                        } catch (e) {

                        }
                    },
                    unhover: (e) => {
                        try {
                            this.resetCountriesColorScheme()

                            if (options.on['unhover']) options.on['unhover'](e)
                        } catch (e) {

                        }
                    }
                }
            },
            options
        )

        if (this.settings.map === "world") {
            this.map = this.settings.antarctica ? createElementFromHTML(WorldMapWithAntarctica) : createElementFromHTML(WorldMap)
        } else if (this.settings.map === "custom") {
            // TODO: сделать импорт карты из customMap - для кастомных карт
        }

        this.init()
    }

    /**
     * Инициализация
     */
    init () {
        if (this.map) {
            this.initMapStyles()

            this.initEvents()

            this.root.appendChild(this.map)
            this.isInit = true
        }
    }

    /**
     * Инициализация цветовой схемы
     */
    initMapStyles() {
        this.resetCountriesColorScheme()
    }

    /**
     * Инициализация событий
     */
    initEvents() {
        const mapContours = this.map.getElementsByTagName('g')
        for (let i = 0; i < mapContours.length; i++) {
            if (this.settings.events['click']) mapContours[i].addEventListener('click', this.settings.events['click'])
            if (this.settings.events['hover']) mapContours[i].addEventListener('mouseenter', this.settings.events['hover'])
            if (this.settings.events['unhover']) mapContours[i].addEventListener('mouseout', this.settings.events['unhover'])
        }
    }

    /**
     * Сброс цветовых схем для всех стран
     */
    resetCountriesColorScheme() {
        if (this.map) {
            let mapElements = []

            mapElements = mapElements.concat(Array.prototype.slice.call(this.map.getElementsByTagName('path')))
            mapElements = mapElements.concat(Array.prototype.slice.call(this.map.getElementsByTagName('rect')))

            for (let i = 0; i < mapElements.length; i++) {
                const eventType = this.settings.selectedCountries.includes(mapElements[i].getAttribute('id')) ? 'selected' : 'default'
                this.changeCountryColorScheme(mapElements[i], eventType)
            }
        }
    }

    /**
     * Метод меняющий цветовую схему для страны
     * @param countryElement
     * @param event
     */
    changeCountryColorScheme(countryElement, event = 'default') {
        let colors = {}
        let className = ''

        switch (event) {
            case 'hover':
                colors.primary = this.settings.style.colors.hoverPrimary
                colors.border = this.settings.style.colors.hoverBorder
                className = 'hover'
                break;
            case 'selected':
                colors.primary = this.settings.style.colors.selectedPrimary
                colors.border = this.settings.style.colors.selectedBorder
                className = 'selected'
                break;
            case 'selected hover':
                colors.primary = this.settings.style.colors.selectedHoverPrimary
                colors.border = this.settings.style.colors.selectedHoverBorder
                className = 'selected hover'
                break;
            case "default":
                colors.primary = this.settings.style.colors.primary
                colors.border = this.settings.style.colors.border
                className = ''
                break;
        }

        countryElement.setAttribute("class", className)
        // countryElement.className = className

        if (colors.primary) countryElement.style.fill = colors.primary
        if (colors.border) countryElement.style.stroke = colors.border

        if (this.settings.style.border.width) countryElement.style.strokeWidth = this.settings.style.border.width
    }
}