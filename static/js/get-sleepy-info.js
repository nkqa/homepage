// 用于取消未完成的请求
let abortController;

// 获取sleepy状态信息
async function getSleepyInfo() {
    const statusDiv = document.querySelector('content .left-div');
    statusDiv.innerHTML = '<h1 style="font-size: 24px; margin-bottom: 10px;">获取中</h1>';
    
    // 取消上一次未完成的请求
    if (abortController) {
        abortController.abort();
    }
    abortController = new AbortController();
    
    try {
        const response = await fetch('https://sleepy.meowco.cn/api/status/query', { signal: abortController.signal });
        const data = await response.json();
        
        if (data.success) {
            const deviceCount = Object.keys(data.device).length;
            let devicesHtml = '';
            
            // 将设备分为在线和离线两组
            const onlineDevices = [];
            const offlineDevices = [];
            
            for (const deviceId in data.device) {
                const device = data.device[deviceId];
                if (device.using) {
                    onlineDevices.push(device);
                } else {
                    offlineDevices.push(device);
                }
            }
            
            // 先遍历在线设备
            for (const device of onlineDevices) {
                const isOnline = device.using;
                const onlineText = isOnline ? '在线' : '离线';
                const onlineColor = isOnline ? '#10b981' : '#ef4444';
                
                // 转换时间戳
                const date = new Date(device.last_updated * 1000);
                const formattedDate = date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                // 生成设备HTML
                devicesHtml += `
                    <div style="margin-top: 20px; padding: 15px; border-radius: 8px; text-align: left; background-color: rgba(31, 41, 55, 0.8);">
                        <p style="font-size: 16px; margin-bottom: 5px;">
                            <span style="color: ${onlineColor}; font-weight: bold;">${onlineText}</span> - ${device.show_name}
                        </p>
                        <p style="font-size: 14px; margin-bottom: 5px; color: #9ca3af;">状态: ${device.status}</p>
                        <p style="font-size: 14px; color: #9ca3af;">最近更新时间: ${formattedDate}</p>
                    </div>
                `;
            }
            
            // 再遍历离线设备
            for (const device of offlineDevices) {
                const isOnline = device.using;
                const onlineText = isOnline ? '在线' : '离线';
                const onlineColor = isOnline ? '#10b981' : '#ef4444';
                
                // 转换时间戳
                const date = new Date(device.last_updated * 1000);
                const formattedDate = date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                // 生成设备HTML
                devicesHtml += `
                    <div style="margin-top: 20px; padding: 15px; border-radius: 8px; text-align: left; background-color: rgba(31, 41, 55, 0.8);">
                        <p style="font-size: 16px; margin-bottom: 5px;">
                            <span style="color: ${onlineColor}; font-weight: bold;">${onlineText}</span> - ${device.show_name}
                        </p>
                        <p style="font-size: 14px; margin-bottom: 5px; color: #9ca3af;">状态: ${device.status}</p>
                        <p style="font-size: 14px; color: #9ca3af;">最近更新时间: ${formattedDate}</p>
                    </div>
                `;
            }
            
            // 转换获取时间
            const fetchDate = new Date(data.time * 1000);
            const fetchFormattedDate = fetchDate.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            statusDiv.innerHTML = `
                <h1 style="font-size: 24px; margin-bottom: 10px;">
                    状态: <span style="color: #61dafb;">${data.status.name}</span> (${data.status.desc})
                </h1>
                <p style="font-size: 18px; margin-top: 20px; text-align: center;">设备列表（总设备数量: ${deviceCount}）</p>
                <p style="font-size: 16px; margin-top: 10px; text-align: center;">在线设备数: ${onlineDevices.length}   离线设备数: ${offlineDevices.length}</p>
                ${devicesHtml}
                <p style="font-size: 14px; margin-top: 20px; color: #9ca3af; text-align: center;">信息获取时间: ${fetchFormattedDate}</p>
            `;
        } else {
            statusDiv.innerHTML = `
                <h1 style="font-size: 24px; margin-bottom: 20px;">获取失败，请重试或联系网站管理员</h1>
                <button onclick="getSleepyInfo()" style="padding: 10px 20px; font-size: 16px; background-color: #61dafb; color: white; border: none; border-radius: 8px; cursor: pointer;">刷新</button>
            `;
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            statusDiv.innerHTML = `
                <h1 style="font-size: 24px; margin-bottom: 20px;">获取失败，请重试或联系网站管理员</h1>
                <button onclick="getSleepyInfo()" style="padding: 10px 20px; font-size: 16px; background-color: #61dafb; color: white; border: none; border-radius: 8px; cursor: pointer;">刷新</button>
            `;
            console.error('Error fetching sleepy info:', error);
        }
    } finally {
        // 清除控制器引用
        abortController = null;
    }
}

// 页面加载完成后获取信息
window.addEventListener('load', getSleepyInfo);

// 每30秒刷新一次
setInterval(getSleepyInfo, 30000);