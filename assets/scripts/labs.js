const $ = (selector) => document.querySelector(selector);
const money = (value) => `$${Math.round(value).toLocaleString()}`;

function updateSolar() {
    if (!$('#solarBill')) return;
    const bill = Number($('#solarBill').value) || 0;
    const roof = Number($('#roofArea').value) || 0;
    const sun = Number($('#sunHours').value) || 0;
    const kw = Math.min(roof / 18, 25);
    const annualKwh = kw * sun * 365 * 0.82;
    const annualSavings = Math.min(annualKwh * 0.18, bill * 12);
    const systemCost = kw * 1100;
    const years = annualSavings ? systemCost / annualSavings : 0;
    $('#solarResult').textContent = years ? `${years.toFixed(1)} year payback` : 'Add your bill and roof size';
    $('#solarDetail').textContent = `${kw.toFixed(1)} kW / about ${money(annualSavings)} saved yearly`;
}

function updateBattery() {
    if (!$('#batteryLoad')) return;
    const load = Number($('#batteryLoad').value) || 0;
    const voltage = Number($('#batteryVoltage').value) || 48;
    const ampHours = load * 1000 / voltage / 0.8;
    $('#batteryResult').textContent = `You need about ${Math.ceil(ampHours).toLocaleString()} Ah.`;
}

function updateImpact() {
    if (!$('#impactSlider')) return;
    const kwh = Number($('#impactSlider').value);
    $('#impactKwh').textContent = kwh.toLocaleString();
    $('#impactNumber').textContent = `${Math.round(kwh / 1000 * 16)} trees`;
}

function updateOrbit() {
    if (!$('#orbitAltitude')) return;
    const altitude = Number($('#orbitAltitude').value);
    const velocity = Math.sqrt(398600.4418 / (6371 + altitude));
    $('#orbitOutput').textContent = `${altitude.toLocaleString()} km / ${velocity.toFixed(2)} km/s`;
    $('#orbitDot').style.left = `${Math.min(96, 2 + altitude / 36000 * 94)}%`;
}

function updateSubnet() {
    if (!$('#ipAddress')) return;
    const parts = $('#ipAddress').value.split('.').map(Number);
    const prefix = Math.max(0, Math.min(32, Number($('#prefixLength').value) || 0));
    if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
        $('#subnetResult').textContent = 'Enter a valid IPv4 address';
        $('#subnetDetail').textContent = '';
        return;
    }
    const ip = parts.reduce((value, part) => (value << 8) + part, 0) >>> 0;
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = ip & mask;
    const display = [network >>> 24, (network >>> 16) & 255, (network >>> 8) & 255, network & 255].join('.');
    const hosts = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.max(0, Math.pow(2, 32 - prefix) - 2);
    $('#subnetResult').textContent = `Network: ${display}/${prefix}`;
    $('#subnetDetail').textContent = `${hosts.toLocaleString()} usable hosts`;
}

function updateInterest() {
    if (!$('#principal')) return;
    const principal = Number($('#principal').value) || 0;
    const contribution = Number($('#contribution').value) || 0;
    const rate = (Number($('#interestRate').value) || 0) / 100 / 12;
    const months = (Number($('#interestYears').value) || 0) * 12;
    const future = rate ? principal * Math.pow(1 + rate, months) + contribution * ((Math.pow(1 + rate, months) - 1) / rate) : principal + contribution * months;
    $('#interestResult').textContent = `${money(future)} after ${months / 12} years`;
}

function updateInflation() {
    if (!$('#inflationAmount')) return;
    const amount = Number($('#inflationAmount').value) || 0;
    const rate = (Number($('#inflationRate').value) || 0) / 100;
    const years = Number($('#inflationYears').value) || 0;
    $('#inflationResult').textContent = `${money(amount / Math.pow(1 + rate, years))} of today's buying power`;
}

function updateMarket() {
    if (!$('#marketPrice')) return;
    const price = Number($('#marketPrice').value);
    const demand = Math.max(0, 100 - price);
    const supply = price;
    $('#marketOutput').textContent = `Price ${price} / demand ${demand} / supply ${supply}`;
    $('#marketDot').style.left = `${price}%`;
    $('#marketDot').style.top = `${100 - demand}%`;
}

function updateRegex() {
    if (!$('#regexPattern')) return;
    const result = $('#regexResult');
    try {
        const regex = new RegExp($('#regexPattern').value, $('#regexFlags').value);
        result.innerHTML = $('#regexText').value.replace(regex, (match) => `<mark>${match}</mark>`);
        const matches = $('#regexText').value.match(regex);
        result.dataset.matches = matches ? `${matches.length} match${matches.length === 1 ? '' : 'es'}` : 'No matches';
    } catch (error) {
        result.textContent = `Pattern error: ${error.message}`;
    }
}

function animateSort() {
    const bars = [...document.querySelectorAll('#sortBars span')];
    bars.forEach((bar, index) => { bar.style.height = `${20 + Math.random() * 75}%`; bar.style.transitionDelay = `${index * 35}ms`; });
}

const snippets = { js: 'const answer = items.map(item => item.value);', py: 'answer = [item.value for item in items]', rust: 'let answer: Vec<_> = items.iter().map(|item| item.value).collect();', go: 'for _, item := range items { answer = append(answer, item.Value) }' };
document.querySelectorAll('input, select, textarea').forEach((element) => element.addEventListener('input', () => { updateSolar(); updateBattery(); updateImpact(); updateOrbit(); updateSubnet(); updateInterest(); updateInflation(); updateMarket(); updateRegex(); }));
document.querySelectorAll('[data-grid-mode]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-grid-mode]').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); if ($('#gridAdvice')) $('#gridAdvice').textContent = button.dataset.gridMode === 'grid' ? 'Best when the grid is reliable and you want simpler maintenance. Batteries can be an optional second step.' : 'Best when outages are common or a connection is unavailable. Add storage and design for your worst week.'; }));
document.querySelectorAll('[data-layout]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-layout]').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); $('#layoutDemo').classList.toggle('grid-mode', button.dataset.layout === 'grid'); }));
document.querySelectorAll('[data-code]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-code]').forEach((item) => item.classList.remove('is-selected')); button.classList.add('is-selected'); $('#codeSnippet').textContent = snippets[button.dataset.code]; }));
if ($('#sortButton')) $('#sortButton').addEventListener('click', animateSort);
if ($('#copyCode')) $('#copyCode').addEventListener('click', async () => { await navigator.clipboard?.writeText($('#codeSnippet').textContent); $('#copyCode').textContent = 'Copied'; setTimeout(() => { $('#copyCode').textContent = 'Copy snippet'; }, 1200); });
const ports = [['SSH', 22, 'remote shell'], ['DNS', 53, 'name resolution'], ['HTTP', 80, 'web traffic'], ['HTTPS', 443, 'encrypted web'], ['FTP', 21, 'file transfer'], ['SMTP', 25, 'mail sending'], ['NTP', 123, 'time sync']];
function renderPorts() { if (!$('#portSearch')) return; const query = $('#portSearch').value.toLowerCase(); $('#portList').innerHTML = ports.filter(([name, port, use]) => `${name} ${port} ${use}`.toLowerCase().includes(query)).map(([name, port, use]) => `<div class="port-row"><b>${name}</b><span>${port}</span><small>${use}</small></div>`).join(''); }
if ($('#portSearch')) $('#portSearch').addEventListener('input', renderPorts);
const initialBars = [58, 34, 80, 44, 68, 27, 91, 49, 73, 39]; if ($('#sortBars')) $('#sortBars').innerHTML = initialBars.map((height) => `<span style="height:${height}%"></span>`).join('');
updateSolar(); updateBattery(); updateImpact(); updateOrbit(); updateSubnet(); updateInterest(); updateInflation(); updateMarket(); updateRegex(); renderPorts();