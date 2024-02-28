
function yahoo_address_search(app_id: string, query: string) {
  const ns = XmlService.getNamespace("http://olp.yahooapis.jp/ydf/1.0")
  const api_endpoint = 'https://map.yahooapis.jp/geocode/V1/geoCoder'
  const url = `${api_endpoint}?appid=${app_id}&query=${encodeURIComponent(query)}`
  const response = UrlFetchApp.fetch(url)
  const xmlText = response.getContentText()
  return parse_xml_response_(xmlText, ns, 'Address')
}

function yahoo_local_search(app_id: string, query: string) {
  const ns = XmlService.getNamespace("http://olp.yahooapis.jp/ydf/1.0")
  const api_endpoint = 'https://map.yahooapis.jp/search/local/V1/localSearch'
  const url = `${api_endpoint}?appid=${app_id}&query=${encodeURIComponent(query)}`
  const response = UrlFetchApp.fetch(url)
  const xmlText = response.getContentText()
  return parse_xml_response_(xmlText, ns, 'Local')
}

const parse_xml_response_ = (
  xml: string,
  ns: GoogleAppsScript.XML_Service.Namespace,
  apitype: 'Address' | 'Local',
) => {
  const document = XmlService.parse(xml)
  const root = document.getRootElement()
  if(root.getName() === "Error") {
    const message = root.getChild("Message").getText()
    const code = root.getChild("Code").getText()
    throw new Error("ERROR: " + message + " (" + code + ")")
  }

  const features = root.getChildren("Feature", ns)
  const feature = features[0]
  if(!feature) {
    return false
  }

  const geometry = feature.getChild("Geometry", ns)
  const type = geometry.getChild("Type", ns).getText()
  const coordinates = geometry.getChild("Coordinates", ns).getText()
  const property = feature.getChild("Property", ns)


  if(type !== "point") {
    throw new Error("ERROR: Unsupported geometry type: " + type)
  }

  const [lng, lat] = coordinates.split(",").map(val => parseFloat(val))

  if(isNaN(lng) || isNaN(lat)) {
    throw new Error("ERROR: Invalid coordinates: " + coordinates)
  }

  if(apitype === 'Address') {
    const addressType = property.getChild("AddressType", ns).getText()
    return`${addressType},${lng},${lat}`
  } else if(apitype === 'Local') {
    const name = feature.getChild("Name", ns).getText()
    return `${name},${lng},${lat}`
  }　else {
    throw new Error("ERROR: Unsupported apitype: " + apitype)
  }
}

// <?xml version=\'1.0\' encoding=\'UTF-8\'?>
// <YDF
// 	xmlns="http://olp.yahooapis.jp/ydf/1.0" totalResultsReturned="9" totalResultsAvailable="9" firstResultPosition="1">
// 	<ResultInfo>
// 		<Count>9</Count>
// 		<Total>9</Total>
// 		<Start>1</Start>
// 		<Status>200</Status>
// 		<Description></Description>
// 		<Latency>0.024</Latency>
// 	</ResultInfo>
// 	<Feature>
// 		<Id>27211.10</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56259378,34.80983047</Coordinates>
// 			<BoundingBox>135.5590010,34.8077000 135.5638670,34.8140300</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>661ce702fbea5af9e554d7e58dbf47460c1057c5</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>3</AddressMatchingLevel>
// 			<AddressType>町・大字</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.2</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町2</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56113560,34.80949434</Coordinates>
// 			<BoundingBox>135.5555356,34.80389434 135.5667356,34.81509434</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>c382114254813eea318c1a727962cbc6a99dd160</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町2</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>5</AddressMatchingLevel>
// 			<AddressType>街区</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.1</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町1</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56127995,34.81244957</Coordinates>
// 			<BoundingBox>135.55567995,34.80684957 135.56687995,34.81804957</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>2c4f4be92cad6dbbb4efbdf6e3c9ac56f7cd76dc</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町1</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>5</AddressMatchingLevel>
// 			<AddressType>街区</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.2.50</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町2-50</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56344649,34.80925835</Coordinates>
// 			<BoundingBox>135.55784649,34.80365835 135.56904649,34.81485835</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>61595fcda4d393fec1931741fcb83f1faacc06b7</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町2-50</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>6</AddressMatchingLevel>
// 			<AddressType>地番・戸番</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.2.150</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町2-150</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56235213,34.81006377</Coordinates>
// 			<BoundingBox>135.55675213,34.80446377 135.56795213,34.81566377</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>101ac8bf7561f462dc37974ea39d323aaea0018c</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町2-150</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>6</AddressMatchingLevel>
// 			<AddressType>地番・戸番</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.1.13</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町1-13</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56133550,34.81282177</Coordinates>
// 			<BoundingBox>135.5557355,34.80722177 135.5669355,34.81842177</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>55f64e4d7f5db59c204c3f8eff9d1f3d4710bd31</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町1-13</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>6</AddressMatchingLevel>
// 			<AddressType>地番・戸番</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.1.17</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町1-17</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56138272,34.81255235</Coordinates>
// 			<BoundingBox>135.55578272,34.80695235 135.56698272,34.81815235</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>329acb0d2eebffc8c1435c58fa2c254081e3c63e</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町1-17</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>6</AddressMatchingLevel>
// 			<AddressType>地番・戸番</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.1.6</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町1-6</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56165768,34.81306619</Coordinates>
// 			<BoundingBox>135.55605768,34.80746619 135.56725768,34.81866619</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>c54908473c4a270e4427c9b0c7d4c3935b4a2a03</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町1-6</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>6</AddressMatchingLevel>
// 			<AddressType>地番・戸番</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// 	<Feature>
// 		<Id>27211.10.1.4</Id>
// 		<Gid></Gid>
// 		<Name>大阪府茨木市岩倉町1-4</Name>
// 		<Geometry>
// 			<Type>point</Type>
// 			<Coordinates>135.56134937,34.81345225</Coordinates>
// 			<BoundingBox>135.55574937,34.80785225 135.56694937,34.81905225</BoundingBox>
// 		</Geometry>
// 		<Description></Description>
// 		<Style/>
// 		<Property>
// 			<Uid>6847c4e0443c2662327d648b2d4f78b999a0b6e3</Uid>
// 			<CassetteId>b22fee69b0dcaf2c2fe2d6a27906dafc</CassetteId>
// 			<Yomi>オオサカフイバラキシイワクラチョウ</Yomi>
// 			<Country>
// 				<Code>JP</Code>
// 				<Name>日本</Name>
// 			</Country>
// 			<Address>大阪府茨木市岩倉町1-4</Address>
// 			<GovernmentCode>27211</GovernmentCode>
// 			<AddressMatchingLevel>6</AddressMatchingLevel>
// 			<AddressType>地番・戸番</AddressType>
// 			<OpenForBusiness></OpenForBusiness>
// 		</Property>
// 	</Feature>
// </YDF>
