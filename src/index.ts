
function yahoo_address_search(app_id: string, query: string) {

  const api_endpoint = 'https://map.yahooapis.jp/geocode/V1/geoCoder'
  const url = `${api_endpoint}?appid=${app_id}&query=${query}`
  const xmlText = fetch_yahoo_address_search_(url)
  const result = parse_xml_response_(xmlText)
  return result
}

const fetch_yahoo_address_search_ = (url: string) => {
  const response = UrlFetchApp.fetch(url)
  return response.getContentText()
}

const parse_xml_response_ = (xml: string) => {
  const document = XmlService.parse(xml)
  const root = document.getRootElement()
  if(root.getName() === "Error") {
    const message = root.getChild("Message").getText()
    const code = root.getChild("Code").getText()
    throw new Error("ERROR: " + message + " (" + code + ")")
  }
  const feature = root.getChild("Feature")
  const geometry = feature.getChild("Geometry")
  const type = geometry.getChild("Type").getText()
  const coordinates = geometry.getChild("Coordinates").getText()

  if(type !== "point") {
    throw new Error("ERROR: Unsupported geometry type: " + type)
  }

  const [lng, lat] = coordinates.split(",").map(val => parseFloat(val))

  if(isNaN(lng) || isNaN(lat)) {
    throw new Error("ERROR: Invalid coordinates: " + coordinates)
  }

  return`${lng},${lat}`
}
