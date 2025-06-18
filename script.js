document.addEventListener('DOMContentLoaded', function() {
    const ipInput = document.getElementById('ipInput');
    const queryBtn = document.getElementById('queryBtn');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const mapDiv = document.getElementById('map');
    
    // 初始化地图
    let map = L.map('map').setView([51.505, -0.09], 3); // 默认中心点和缩放级别
    
    // 添加OpenStreetMap图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // 创建一个空的标记组
    let markers = L.layerGroup().addTo(map);
    
    // 自动聚焦到输入框
    ipInput.focus();
    
    // 查询按钮点击事件
    queryBtn.addEventListener('click', queryIpInfo);
    
    // 回车键触发查询
    ipInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            queryIpInfo();
        }
    });
    
    // 查询IP信息函数
    function queryIpInfo() {
        const ip = ipInput.value.trim();
        
        // 清空之前的结果和错误信息
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        
        // 清除之前的标记
        markers.clearLayers();
        
        // 显示加载中
        loadingDiv.classList.remove('hidden');
        
        // 如果没有输入IP，则查询本机IP
        const apiUrl = ip === '' ? 
            'https://ipapi.co/json/' : 
            `https://ipapi.co/${ip}/json/`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法获取IP信息');
                }
                return response.json();
            })
            .then(data => {
                // 隐藏加载中
                loadingDiv.classList.add('hidden');
                
                // 显示结果
                displayResult(data);
                
                // 如果有经纬度信息，显示地图标记
                if (data.latitude && data.longitude) {
                    showOnMap(data.latitude, data.longitude, data.city || data.country_name || '未知位置');
                } else {
                    errorDiv.textContent = '该IP地址没有位置信息';
                    errorDiv.classList.remove('hidden');
                }
            })
            .catch(error => {
                // 隐藏加载中
                loadingDiv.classList.add('hidden');
                
                // 显示错误信息
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('hidden');
            });
    }
    
    // 显示查询结果
    function displayResult(data) {
        // 填充数据
        document.getElementById('resIp').textContent = data.ip || 'N/A';
        document.getElementById('resCountry').textContent = data.country_name || 'N/A';
        document.getElementById('resRegion').textContent = data.region || 'N/A';
        document.getElementById('resCity').textContent = data.city || 'N/A';
        document.getElementById('resZip').textContent = data.postal || 'N/A';
        document.getElementById('resLat').textContent = data.latitude || 'N/A';
        document.getElementById('resLon').textContent = data.longitude || 'N/A';
        document.getElementById('resTimezone').textContent = data.timezone || 'N/A';
        document.getElementById('resIsp').textContent = data.org || 'N/A';
        document.getElementById('resOrg').textContent = data.asn || 'N/A';
        document.getElementById('resAs').textContent = data.asn || 'N/A';
        
        // 显示结果区域
        resultDiv.classList.remove('hidden');
    }
    
    // 在地图上显示位置
    function showOnMap(lat, lng, locationName) {
        // 添加标记
        const marker = L.marker([lat, lng]).addTo(map);
        
        // 添加弹出窗口
        marker.bindPopup(`<b>IP位置</b><br>${locationName}<br>纬度: ${lat}<br>经度: ${lng}`);
        
        // 将地图中心移动到标记位置
        map.setView([lat, lng], 13);
        
        // 将标记添加到标记组
        markers.addLayer(marker);
    }
});
