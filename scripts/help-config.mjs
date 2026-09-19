// One source for browser shortcuts and the AI's approved answers.
export function helpConfig(site) {
  const faq = word => site.faq.find(item => item.question.includes(word))?.answer || '';
  const answers = {
    entry: '방문 전 예약 확정과 별도로 전달받은 입실 안내를 확인해 주세요. 이 도우미는 출입 비밀번호를 제공하거나 문을 열 수 없습니다. 안내를 받지 못하셨다면 매장으로 문의해 주세요.',
    live: '실시간 빈방과 예약 내역은 네이버 예약에서 확인해 주세요. 취소·변경 조건과 최종 금액도 해당 예약 화면에서 확인할 수 있습니다. C6 홀과 개인룸은 전화로 문의해 주세요.',
    minimum: faq('30분'),
    parking: site.parking,
    hours: faq('늦은 밤'),
    rates: '30분 기준 요금이며 최소 1시간부터 예약할 수 있습니다.\n\n' + site.rates.map(rate => rate.name + ' — ' + rate.price).join('\n') + '\n\n최종 금액은 네이버 예약에서 확인해 주세요. C6 홀과 개인룸은 전화 문의가 필요합니다.',
    practice: faq('어떤 연습'),
    hall: faq('C6'),
    booking: '일반 연습실은 네이버 예약에서 방과 날짜·시간을 선택해 주세요. 최소 1시간부터 예약할 수 있습니다. 예약 확정과 전달받은 입실 안내를 확인한 뒤 방문해 주세요. C6 홀과 개인룸은 전화로 예약 가능 시간을 문의해 주세요.',
    location: [site.address.addressRegion, site.address.addressLocality, site.address.streetAddress].join(' ') + '입니다. 뉴코아아울렛 뒤편, 배스킨라빈스·파리바게트 건물 10층입니다. 인천터미널역 2번 출구 또는 예술회관역 5·6번 출구에서 도보 약 4분입니다. 자세한 길찾기는 오시는 길 페이지를 확인해 주세요.',
    facilities: '기업용 무료 무제한 Wi-Fi, 시스템 에어컨·바닥난방·개인 환풍기·LAN 포트·개인 전자키를 갖췄습니다. 비접촉 정수기, 남녀 구분 전용 화장실과 샤워실도 마련돼 있습니다. 공용시설 청소는 매주 월·수·금 진행합니다.',
    unknown: '확인된 안내에서 답을 찾지 못했습니다. 요금·예약·주차·운영 시간 버튼을 선택하시거나 카카오톡·전화로 문의해 주세요.'
  };
  const rules = [
    ['entry', '비번|비밀번호|출입.?코드|현관|입실|문.?열'],
    ['live', '예약.*확인|예약.*조회|예약.*했|빈.?방|공실|비었|비어|비는|잔여|남아|지금.*가능|오늘.*가능|내일.*가능|취소|환불|변경'],
    ['minimum', '30분|삼십분|최소|1시간.*예약|한.?시간.*예약'],
    ['parking', '주차|차량'], ['rates', '요금|얼마(?!나.*(?:걸|오래|거리))|가격|비용|금액'],
    ['hall', 'C6|씨식스|홀|5번'],
    ['practice', '악기|성악|보컬|트럼펫|관악|현악|드럼|색소폰|방송|유튜브'],
    ['booking', '예약'], ['hours', '시간|영업|운영|밤|새벽|주말|휴무'],
    ['location', '주소|위치|가는|오시는|어디|지하철'],
    ['facilities', '와이파이|wifi|Wi-Fi|인터넷|시설|에어컨|난방|환기|샤워|화장실|정수기|청소']
  ];
  return { endpoint:site.assistant?.enabled ? '/api/help' : '', answers, rules };
}
