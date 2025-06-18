document.addEventListener('DOMContentLoaded', function() {
    const ipInput = document.getElementById('ipInput');
    const queryBtn = document.getElementById('queryBtn');
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    const apiResponseDiv = document.getElementById('apiResponse');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    
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
                
                // 显示API响应
                displayApiResponse(data);
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
        // 构建结果HTML
        let resultHtml = `
            <p><strong>IP地址:</strong> ${data.ip || 'N/A'}</p>
            <p><strong>国家:</strong> ${data.country_name || 'N/A'}</p>
            <p><strong>国家代码:</strong> ${data.country || 'N/A'}</p>
            <p><strong>地区:</strong> ${data.region || 'N/A'}</p>
            <p><strong>地区代码:</strong> ${data.region_code || 'N/A'}</p>
            <p><strong>城市:</strong> ${data.city || 'N/A'}</p>
            <p><strong>邮政编码:</strong> ${data.postal || 'N/A'}</p>
            <p><strong>纬度:</strong> ${data.latitude || 'N/A'}</p>
            <p><strong>经度:</strong> ${data.longitude || 'N/A'}</p>
            <p><strong>时区:</strong> ${data.timezone || 'N/A'}</p>
            <p><strong>UTC偏移:</strong> ${data.utc_offset || 'N/A'}</p>
            <p><strong>国家货币:</strong> ${data.currency || 'N/A'}</p>
            <p><strong>语言:</strong> ${data.languages || 'N/A'}</p>
            <p><strong>组织:</strong> ${data.org || 'N/A'}</p>
            <p><strong>AS编号:</strong> ${data.asn || 'N/A'}</p>
            <p><strong>ISP:</strong> ${data.asn || 'N/A'}</p>
            <p><strong>反向DNS:</strong> ${data.reverse || 'N/A'}</p>
            <p><strong>移动网络:</strong> ${data.mobile || 'N/A'}</p>
            <p><strong>代理:</strong> ${data.proxy || 'N/A'}</p>
            <p><strong>托管:</strong> ${data.hosting || 'N/A'}</p>
            <p><strong>查询时间:</strong> ${data.query || 'N/A'}</p>
        `;
        
        resultContent.innerHTML = resultHtml;
        
        // 显示结果区域
        resultDiv.classList.remove('hidden');
    }
    
    // 显示API响应
    function displayApiResponse(data) {
        // 格式化JSON响应
        const formattedJson = JSON.stringify(data, null, 2);
        
        // 添加语法高亮
        const highlightedJson = formattedJson
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
                match => {
                    let cls = 'json-number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'json-key';
                        } else {
                            cls = 'json-string';
                        }
                    } else if (/true|false|null/.test(match)) {
                        cls = 'json-bool';
                    }
                    return `<span class="${cls}">${match}</span>`;
                })
            .replace(/\n/g, '<br>')
            .replace(/ /g, '&nbsp;');
        
        apiResponseDiv.innerHTML = highlightedJson;
    }
});
