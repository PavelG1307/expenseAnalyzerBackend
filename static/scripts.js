window.addEventListener('load', async () => {
    if (navigator.serviceWorker) {
        try {
            await navigator.serviceWorker.register('./sw.js')
        } catch (e) {
            console.log('Service worker register fail')
        }
    }
})

const page = 'main'
const url = 'https://fifthfloor.site/exp/api'
const token = 'sdfhjadsjkdfhkjashjdhafjahjfkshj'
const buttons = document.getElementsByClassName('menu_btn')
for (const i in buttons) {
    buttons[i].onclick = (ev) => {
        const id = ev.target.id
        if (id === page) return
        document.location.href = `/exp/${id}`
    }
}
const summEl = document.getElementById('summ')
const unexpectedEl = document.getElementById('unexpected')
const profitEl = document.getElementById('profit')
const commentEl = document.getElementById('comment')
document.getElementById('save').addEventListener('click', async () => {
    const value = Number(summEl.value)
    const unexpected = unexpectedEl.checked
    const profit = profitEl.checked
    const comment = commentEl.value
    const type = 1
    console.log({ value, unexpected, comment, profit, type })
    const res = await axios({
        method: 'post',
        url,
        data: { value, unexpected, comment, profit, type }
    })
    if (res?.data?.success) {
        summEl.value = ''
        unexpectedEl.checked = false
        profitEl.checked = false
        commentEl.value = ''
    }
})