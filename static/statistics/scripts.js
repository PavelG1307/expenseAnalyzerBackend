const page = 'statistics'
// const url = 'http://localhost:8080/api'
const url = 'https://fifthfloor.site/exp/api'
const token = 'sdfhjadsjkdfhkjashjdhafjahjfkshj'
const table = document.getElementsByClassName('zebra')[0]
const balanceMonth = document.getElementById('balance')
const balanceDay = document.getElementById('balanceDay')

const buttons = document.getElementsByClassName('menu_btn')
for (const i in buttons) {
  buttons[i].onclick = (ev) => {
    const id = ev.target.id
    if (id === page) return
    document.location.href = `/exp/${id}`
  }
}
const labels = []
const series = []
// for (let i =1; i <= 30; i++) {
//     labels.push(i)
//     series.push(Math.floor(Math.random() * 50000))
// }
// var data = {
//     labels,
//     series: [series]
//   };

// //   var options = {
// //     seriesBarDistance: 15
// //   };

// //   var responsiveOptions = [
// //     ['screen and (min-width: 641px) and (max-width: 1024px)', {
// //       seriesBarDistance: 10,
// //       axisX: {
// //         labelInterpolationFnc: function (value) {
// //           return value;
// //         }
// //       }
// //     }],
// //     ['screen and (max-width: 640px)', {
// //       seriesBarDistance: 5,
// //       axisX: {
// //         labelInterpolationFnc: function (value) {
// //           return value[0];
// //         }
// //       }
// //     }]
// //   ];

//   new Chartist.Bar('.ct-chart', data);

//   new Chartist.Bar('.ct-chart2', data);

let data = []
axios({
  method: 'get',
  url,
  params: { token }
}).then(res => {
  if (!res.data.success) return
  data = res.data.data
  fillData(data)
})

const fillData = (data) => {
  const monthName = {
    1: 'января',
    2: 'Ф'
  }
  for (const row of data) {
    console.log(row)
    const date = new Date(row.date)
    const dateStr = date.getDate() + ' ' 
    + date.toLocaleString('default', { month: 'short' }) + ' '  + date.getHours() + ':' + date.getMinutes()
    console.log(dateStr)
    const htmlRow = `
    <tr>
    <td>${dateStr}</td>
    <td>${row.value}</td>
    <td>${row.unexpectly ? 'Да' : 'Нет'}</td>
    <td>${row.profit ? 'Да' : 'Нет'}</td>
    <td>${row.comment}</td>
    </tr>`
    table.insertAdjacentHTML('beforeend', htmlRow)
    const now = new Date()
    const zp = new Date()
    zp.setMonth(now.getMonth() + 1)
    zp.setDate(1)
    const diff = (zp - now)/(1000*60*60*24)
    const balanceDayStr = 'Баланс на день: ' + Math.round(data.at(-1).balance / diff) + ' руб.'
    const balanceStr = 'У вас осталось: ' + Math.round(data.at(-1).balance) + 'руб. до 1 ' +  zp.toLocaleString('default', { month: 'short' })
    balanceMonth.innerText = balanceStr
    balanceDay.innerText = balanceDayStr

  }
}
