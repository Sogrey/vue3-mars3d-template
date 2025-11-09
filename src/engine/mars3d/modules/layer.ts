import * as mars3d from 'mars3d'
import MarsEnging from '../'
import * as Utils from '../utils'

interface BaseLayerOptions {
  id: string | number
  type: string
  show: boolean
}

export default class Layer {
  private engine: MarsEnging
  private loadedLayer: Map<string | number, mars3d.layer.BaseLayer> = new Map()

  constructor(engine: MarsEnging) {
    this.engine = engine
  }

  async addLayer(layerOptions: object, options: object = {}): Promise<mars3d.layer.BaseLayer> {
    //     const creditHtml = `©2023 中科星图- <span>审图号：GS (2023) 1924号</span>
    // -  甲测资字11111577 - <a href="https://geovisearth.com/declaration#/user" target="_blank" trace="tos">服务条款</a> `
    //     // 请自行申请token后替换，星图地球官方地址：https://datacloud.geovisearth.com/support/map/summary
    //     const geovisearthToken = "e798bab7f6b7f267972c054e193f2818786bbe4bb1755fc46ea0ea09c03e4693"

    //     const options = {
    //       pid: 10,
    //       name: "星图影像",
    //       icon: "https://data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
    //       type: "group",
    //       layers: [
    //         {
    //           name: "底图",
    //           type: "xyz",
    //           url: "https://tiles{s}.geovisearth.com/base/v1/img/{z}/{x}/{y}?token=" + geovisearthToken,
    //           subdomains: "123"
    //         },
    //         {
    //           name: "注记",
    //           type: "xyz",
    //           url: "https://tiles{s}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?token=" + geovisearthToken,
    //           subdomains: "123"
    //         }
    //       ],
    //       show: true,
    //       credit: creditHtml
    //     }
    //     const layer = new mars3d.layer.GroupLayer(options)



    const mergeOptions: BaseLayerOptions = {
      ...{ id: Utils.uuid('D'), type: '', show: true },
      ...layerOptions,
      ...options
    }

    const layer = await LayerManager.addLayer(mergeOptions, mergeOptions.show)

    this.loadedLayer.set(layer.id, layer)

    return layer
  }

  removeLayer(layerId: string | number, hasDestroy: boolean = true): boolean {
    const layer = this.loadedLayer.get(layerId)
    if (layer) {
      this.engine.map?.removeLayer(layer, hasDestroy)
      this.loadedLayer.delete(layerId)
      if (hasDestroy) {
        layer.destroy()
      }
      console.log('移除图层', layerId)
      return true
    }
    return false
  }

  removeAllLayer(hasDestroy: boolean = true) {
    this.loadedLayer.forEach((layer) => this.removeLayer(layer.id, hasDestroy))
  }

  getLayer(layerId: string | number): mars3d.layer.BaseLayer | undefined {
    return this.loadedLayer.get(layerId)
  }

  getLayerIds(): (string | number)[] {
    return Array.from(this.loadedLayer.keys())
  }

  getLayerCount(): number {
    return this.loadedLayer.size
  }

  getLayerList(): mars3d.layer.BaseLayer[] {
    return Array.from(this.loadedLayer.values())
  }

  getLayerMap(): Map<string | number, mars3d.layer.BaseLayer> {
    return this.loadedLayer
  }

}

class LayerManager {

  static async addLayer(options: any, showVal: boolean = true): Promise<
    mars3d.layer.ArcGisCacheLayer |
    mars3d.layer.ArcGisLayer |
    mars3d.layer.ArcGisTileLayer |
    mars3d.layer.ArcGisWfsLayer |
    mars3d.layer.ArcGisWfsSingleLayer |
    mars3d.layer.BaiduLayer |
    mars3d.layer.BaseGraphicLayer |
    mars3d.layer.BaseLayer |
    mars3d.layer.BaseTileLayer |
    mars3d.layer.BingLayer |
    mars3d.layer.BusineDataLayer |
    mars3d.layer.CanvasWindLayer |
    mars3d.layer.CzmGeoJsonLayer |
    mars3d.layer.CzmlLayer |
    mars3d.layer.EchartsLayer |
    mars3d.layer.EmptyTileLayer |
    mars3d.layer.GaodeLayer |
    mars3d.layer.GeeLayer |
    mars3d.layer.GeoJsonLayer |
    mars3d.layer.GoogleLayer |
    mars3d.layer.GraphicLayer |
    mars3d.layer.GraticuleLayer |
    mars3d.layer.GridLayer |
    mars3d.layer.GroupLayer |
    mars3d.layer.HeatLayer |
    mars3d.layer.I3SLayer |
    mars3d.layer.ImageLayer |
    mars3d.layer.KmlLayer |
    mars3d.layer.LodGraphicLayer |
    mars3d.layer.MapboxLayer |
    mars3d.layer.MapVLayer |
    mars3d.layer.ModelLayer |
    mars3d.layer.OsmBuildingsLayer |
    mars3d.layer.OsmLayer |
    mars3d.layer.PoiLayer |
    mars3d.layer.TdtLayer |
    mars3d.layer.TencentLayer |
    mars3d.layer.TerrainLayer |
    mars3d.layer.TileInfoLayer |
    mars3d.layer.TilesetLayer |
    mars3d.layer.TmsLayer |
    mars3d.layer.WfsLayer |
    mars3d.layer.WfsSingleLayer |
    mars3d.layer.WindLayer |
    mars3d.layer.WmsLayer |
    mars3d.layer.WmtsLayer |
    mars3d.layer.XyzLayer
  > {
    let layer: mars3d.layer.BaseLayer

    switch (options.type.toString().toLocaleLowerCase()) {
      case 'arcgiscache':
        layer = new mars3d.layer.ArcGisCacheLayer(options)
        break;
      case 'arcgis':
        layer = new mars3d.layer.ArcGisLayer(options)
        break;
      case 'arcgistile':
        layer = new mars3d.layer.ArcGisTileLayer(options)
        break;
      case 'arcgiswfs':
        layer = new mars3d.layer.ArcGisWfsLayer(options)
        break;
      case 'arcgiswfssingle':
        layer = new mars3d.layer.ArcGisWfsSingleLayer(options)
        break;
      case 'baidu':
        layer = new mars3d.layer.BaiduLayer(options)
        break;
      case 'basegraphic':
        layer = new mars3d.layer.BaseGraphicLayer(options)
        break;
      case 'bing':
        layer = new mars3d.layer.BingLayer(options)
        break;
      case 'businedata':
        layer = new mars3d.layer.BusineDataLayer(options)
        break;
      case 'canvaswind':
        layer = new mars3d.layer.CanvasWindLayer(options)
        break;
      case 'czmgeojson':
        layer = new mars3d.layer.CzmGeoJsonLayer(options)
        break;
      case 'czml':
        layer = new mars3d.layer.CzmlLayer(options)
        break;
      case 'echarts':
        layer = new mars3d.layer.EchartsLayer(options)
        break;
      case 'emptytile':
        layer = new mars3d.layer.EmptyTileLayer(options)
        break;
      case 'gaode':
        layer = new mars3d.layer.GaodeLayer(options)
        break;
      case 'gee':
        layer = new mars3d.layer.GeeLayer(options)
        break;
      case 'geojson':
        layer = new mars3d.layer.GeoJsonLayer(options)
        break;
      case 'google':
        layer = new mars3d.layer.GoogleLayer(options)
        break;
      case 'graphic':
        layer = new mars3d.layer.GraphicLayer(options)
        break;
      case 'graticule':
        layer = new mars3d.layer.GraticuleLayer(options)
        break;
      case 'grid':
        layer = new mars3d.layer.GridLayer(options)
        break;
      case 'group':
        layer = new mars3d.layer.GroupLayer(options)
        break;
      case 'heat':
        layer = new mars3d.layer.HeatLayer(options)
        break;
      case 'i3s':
        layer = new mars3d.layer.I3SLayer(options)
        break;
      case 'image':
        layer = new mars3d.layer.ImageLayer(options)
        break;
      case 'kml':
        layer = new mars3d.layer.KmlLayer(options)
        break;
      case 'lodgraphic':
        layer = new mars3d.layer.LodGraphicLayer(options)
        break;
      case 'mapbox':
        layer = new mars3d.layer.MapboxLayer(options)
        break;
      case 'mapv':
        layer = new mars3d.layer.MapVLayer(options)
        break;
      case 'model':
        layer = new mars3d.layer.ModelLayer(options)
        break;
      case 'osmbuildings':
        layer = new mars3d.layer.OsmBuildingsLayer(options)
        break;
      case 'osm':
        layer = new mars3d.layer.OsmLayer(options)
        break;
      case 'poi':
        layer = new mars3d.layer.PoiLayer(options)
        break;
      case 'tdt':
        layer = new mars3d.layer.TdtLayer(options)
        break;
      case 'tencent':
        layer = new mars3d.layer.TencentLayer(options)
        break;
      case 'terrain':
        layer = new mars3d.layer.TerrainLayer(options)
        break;
      case 'tileinfo':
        layer = new mars3d.layer.TileInfoLayer(options)
        break;
      case 'tileset':
        layer = new mars3d.layer.TilesetLayer(options)
        break;
      case 'tms':
        layer = new mars3d.layer.TmsLayer(options)
        break;
      case 'wfs':
        layer = new mars3d.layer.WfsLayer(options)
        break;
      case 'wfssingle':
        layer = new mars3d.layer.WfsSingleLayer(options)
        break;
      case 'wind':
        layer = new mars3d.layer.WindLayer(options)
        break;
      case 'wms':
        layer = new mars3d.layer.WmsLayer(options)
        break;
      case 'wmts':
        layer = new mars3d.layer.WmtsLayer(options)
        break;
      case 'xyz':
        layer = new mars3d.layer.XyzLayer(options)
        break;
      default:
        throw new Error(`Unsupported layer type: ${options.type}`)
    }

    layer.on(mars3d.EventType.load, (event) => {
      console.log(`${options.type || 'Layer'} 加载完成`, event)
    })
    layer.on(mars3d.EventType.error, (event) => {
      console.log(`${options.type || 'Layer'} 加载失败`, event)
    })
    layer.on(mars3d.EventType.remove, (event) => {
      console.log(`${options.type || 'Layer'} 移除完成`, event)
    })

    await MarsEnging.getInstance().map?.addLayer(layer, showVal)

    return layer
  }
}



