/**
 * 获取当前定位，并在地图上标识
 * @param map
 */
export function getLocalPosition (map) {
  const { BMap } = window
  const geolocation = new BMap.Geolocation()
  geolocation.enableSDKLocation()
  geolocation.getCurrentPosition(function (r) {
    if (r && r.point) {
      window.localPoint = r.point
      if (map) {
        const mk = new BMap.Marker(r.point)
        map.addOverlay(mk)
        map.panTo(r.point)
        map.setZoom(17)
      }
    }
  })
}
