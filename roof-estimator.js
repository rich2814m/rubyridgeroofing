const roofEstimator = document.querySelector('#roof-estimator');

if (roofEstimator && !roofEstimator.dataset.estimatorReady) {
  roofEstimator.dataset.estimatorReady = 'true';

  const roofingRates = {
    asphalt: { label: 'architectural asphalt shingles', low: 475, high: 725 },
    corrugated: { label: 'corrugated metal roofing', low: 700, high: 1100 },
    'standing-seam': { label: 'standing seam metal roofing', low: 1000, high: 1600 }
  };

  const roofingMoney = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  roofEstimator.addEventListener('submit', (event) => {
    event.preventDefault();

    const length = Number(document.querySelector('#roof-length').value);
    const width = Number(document.querySelector('#roof-width').value);
    const pitch = Number(document.querySelector('#roof-pitch').value);
    const stories = Number(document.querySelector('#roof-stories').value);
    const complexity = Number(document.querySelector('#roof-complexity').value);
    const layers = Number(document.querySelector('#roof-layers').value);
    const materialKey = document.querySelector('#roof-material').value;
    const material = roofingRates[materialKey];

    if (!length || !width || length < 10 || width < 10) return;

    const roofArea = length * width * pitch * 1.1;
    const squares = roofArea / 100;
    const tearOffLow = layers * 75;
    const tearOffHigh = layers * 135;
    const low = Math.round((squares * (material.low + tearOffLow) * stories * complexity) / 250) * 250;
    const high = Math.round((squares * (material.high + tearOffHigh) * stories * complexity) / 250) * 250;
    const pitchLabel = document.querySelector('#roof-pitch').selectedOptions[0].text;
    const storyLabel = document.querySelector('#roof-stories').selectedOptions[0].text.toLowerCase();
    const complexityLabel = document.querySelector('#roof-complexity').selectedOptions[0].text.split(' — ')[0].toLowerCase();
    const layersLabel = layers === 0 ? 'no tear-off' : `${layers} existing layer${layers === 1 ? '' : 's'} to remove`;

    document.querySelector('#estimate-price').textContent = `${roofingMoney.format(low)}–${roofingMoney.format(high)}`;
    document.querySelector('#estimate-area').textContent = `${Math.round(roofArea).toLocaleString()} sq. ft.`;
    document.querySelector('#estimate-squares').textContent = squares.toFixed(1);
    document.querySelector('#estimate-summary').textContent = `${material.label}, ${pitchLabel} pitch, ${storyLabel}, ${complexityLabel} layout, and ${layersLabel}. Includes a 10% planning allowance for waste.`;

    const message = `Hi Ruby Ridge, I used your website estimator. My building is about ${length} ft × ${width} ft with a ${pitchLabel} roof. I selected ${material.label}, ${storyLabel}, ${complexityLabel} complexity, and ${layersLabel}. The website estimated ${Math.round(roofArea).toLocaleString()} sq. ft. and a ${roofingMoney.format(low)}–${roofingMoney.format(high)} ballpark range. I'd like to arrange an inspection.`;
    document.querySelector('#estimate-text').href = `sms:+12072995764?body=${encodeURIComponent(message)}`;

    const result = document.querySelector('#estimate-result');
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
