#!/bin/sh

# luci-app-dnsleaktest 汉化脚本
# 适用环境: OpenWrt/iStoreOS

set -e

# 定义目标文件
TEST_JS="/www/luci-static/resources/view/dnsleaktest/test.js"
RESULT_JS="/www/luci-static/resources/view/dnsleaktest/result.js"
MENU_JSON="/usr/share/luci/menu.d/luci-app-dnsleaktest.json"

echo "正在开始汉化 luci-app-dnsleaktest..."

# 汉化函数
localize_file() {
    local file=$1
    if [ -f "$file" ]; then
        echo "正在处理: $file"
        # 汉化菜单和标题
        sed -i "s/_('DNS Leak Test')/'DNS 泄漏测试'/g" "$file"
        sed -i 's/"title": "DNS Leak Test"/"title": "DNS 泄漏测试"/g' "$file"
        sed -i 's/"title": "Result"/"title": "测试结果"/g' "$file"
        
        # 汉化 test.js / result.js 中的字符串
        sed -i "s/_('Perform a DNS Leak Test to check the security of your DNS settings.')/'执行 DNS 泄漏测试以检查您的 DNS 设置安全性。'/g" "$file"
        sed -i "s/_('Status')/'状态'/g" "$file"
        sed -i "s/_('Available')/'可用'/g" "$file"
        sed -i "s/_('Information')/'信息'/g" "$file"
        sed -i "s/_('ID')/'ID'/g" "$file"
        sed -i "s/_('IP Address')/'IP 地址'/g" "$file"
        sed -i "s/_('Country')/'国家\/地区'/g" "$file"
        sed -i "s/_('DNS Server')/'DNS 服务器'/g" "$file"
        sed -i "s/_('Servers Found')/'发现服务器'/g" "$file"
        sed -i "s/_('Conclusion')/'结论'/g" "$file"
        sed -i "s/_('Results')/'测试结果'/g" "$file"
        sed -i "s/_('No')/'序号'/g" "$file"
        sed -i "s/_('Running')/'运行中'/g" "$file"
        sed -i "s/_('Finished')/'已完成'/g" "$file"
        sed -i "s/_('Test ID')/'测试 ID'/g" "$file"
        sed -i "s/_('Date and time of test')/'测试日期与时间'/g" "$file"
        sed -i "s/_('Use')/'用途'/g" "$file"
        sed -i "s/_('DNS Servers')/'DNS 服务器'/g" "$file"
        sed -i "s/_('Error writing information data to file')/'写入信息数据到文件时出错'/g" "$file"
        sed -i "s/_('Error writing DNS data to file')/'写入 DNS 数据到文件时出错'/g" "$file"
        sed -i "s/_('An error occurred while getting dnsleak test.')/'获取 DNS 泄漏测试结果时出错。'/g" "$file"
        sed -i "s/_('Failed to get ID.')/'获取 ID 失败。'/g" "$file"
        sed -i "s/_('An error occurred while getting ID.')/'获取 ID 时出错。'/g" "$file"
        sed -i "s/_('No internet connection. Please check your internet connection or try again later.')/'无网络连接。请检查您的网络连接或稍后再试。'/g" "$file"
        sed -i "s/_('Please install curl to run internet test.')/'请安装 curl 以运行互联网测试。'/g" "$file"
        sed -i "s/_('Start')/'开始测试'/g" "$file"
        sed -i "s/_('Download')/'下载'/g" "$file"
        sed -i "s/_('Remove data')/'删除数据'/g" "$file"
        sed -i "s/_('Are you sure you want to remove this data?')/'确定要删除此数据吗？'/g" "$file"
        sed -i "s/_('Cancel')/'取消'/g" "$file"
        sed -i "s/_('Remove')/'删除'/g" "$file"
        sed -i "s/_('Date')/'日期'/g" "$file"
        sed -i "s/_('Time')/'时间'/g" "$file"
        sed -i "s/_('No data available.')/'无测量结果。'/g" "$file"
        sed -i "s/_('DNS Leak Test by ID')/'按测试 ID 下载结果'/g" "$file"
    else
        echo "跳过: $file (文件不存在)"
    fi
}

# 执行汉化
localize_file "$TEST_JS"
localize_file "$RESULT_JS"
localize_file "$MENU_JSON"

# 清除 LuCI 缓存
rm -rf /tmp/luci-indexcache /tmp/luci-modulecache

echo "汉化完成！请刷新浏览器页面查看效果。"
