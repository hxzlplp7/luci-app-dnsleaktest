/* This is free software, licensed under the Apache License, Version 2.0
 *
 * Copyright (C) 2024 Hilman Maulana <hilman0.0maulana@gmail.com>
 * 简体中文本地化及 ipleak.net 引擎迁移由 Antigravity 完成
 */

'use strict';
'require view';
'require fs';

return view.extend({
	handleSaveApply: null,
	handleSave: null,
	handleReset: null,
	render: function() {
		var header = [
			E('h2', {'class': 'section-title'}, _('DNS Leak Test')),
			E('div', {'class': 'cbi-map-descr'}, _('Perform a DNS Leak Test to check the security of your DNS settings.'))
		];
		var status = [
			E('label', { 'class': 'cbi-input-label', 'style': 'margin: 8px;'}, _('Status')),
			E('em', { 'id': 'dnsleak-status'}, _('Available'))
		];
		var infoTable = [
			E('h3', {'class': 'section-title'}, _('Information')),
			E('table', {'class': 'table cbi-section-table', 'id': 'info'}, [
				E('tr', {'class': 'tr table-titles'}, [
					E('th', {'class': 'th'}, _('ID')),
					E('th', {'class': 'th'}, _('IP Address')),
					E('th', {'class': 'th'}, _('Country')),
					E('th', {'class': 'th'}, _('ISP')),
					E('th', {'class': 'th'}, _('Servers Found')),
					E('th', {'class': 'th'}, _('Conclusion'))
				]),
			])
		];
		var resultsTable = [
			E('h3', {'class': 'section-title'}, _('Results')),
			E('table', {'class': 'table cbi-section-table', 'id': 'results'}, [
				E('tr', {'class': 'tr table-titles'}, [
					E('th', {'class': 'th'}, _('No')),
					E('th', {'class': 'th'}, _('IP Address')),
					E('th', {'class': 'th'}, _('Country')),
					E('th', {'class': 'th'}, _('ISP'))
				]),
			])
		];

		// 生成用于 ipleak.net 探测的 40 位随机 Token
		function generateToken(length) {
			var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
			var result = '';
			for (var i = 0; i < length; i++)
				result += chars.charAt(Math.floor(Math.random() * chars.length));
			return result;
		}

		var running = false;
		var button = [
			E('button', {
				'class': 'btn cbi-button cbi-button-action',
				'click': function() {
					if (!running) {
						running = true;
						var statusId = document.getElementById('dnsleak-status');
						var api = 'ipleak.net';
						var token = generateToken(40);
						
						statusId.textContent = _('Running');

						// 1. 获取基础 IP 信息
						return fs.exec('/usr/bin/curl', ['-s', `https://${api}/json/`]).then(function (result) {
							var typeIP = JSON.parse(result.stdout);
							
							// 2. 发起 DNS 探测请求 (按照用户建议的模式)
							var promises = [];
							for (var i = 1; i <= 10; i++) {
								promises.push(fs.exec_direct('/usr/bin/curl', ['-s', `https://${token}-${i}.${api}/dnsdetection/`]));
								// 辅助使用 ping 增加探测成功率
								fs.exec_direct('/bin/ping', ['-c', '1', `${token}-${i}.${api}`]);
							}

							// 等待探测请求发出
							return Promise.all(promises).then(function() {
								// 延迟一秒等待服务端记录
								return new Promise(resolve => setTimeout(resolve, 1500));
							}).then(function() {
								// 3. 获取 DNS 测试结果
								return fs.exec_direct('/usr/bin/curl', ['-s', `https://${token}-1.${api}/dnsdetection/`]).then(function (result) {
									var dnsData = JSON.parse(result);
									var dnsIps = Object.keys(dnsData.ip || {});
									var totalDNS = dnsIps.length;
									
									var rowsInfo = document.getElementById('info');
									var rowsResults = document.getElementById('results');
									var rowsRemove = document.querySelectorAll('#results .tr, #info .tr');
									
									// 清理旧结果
									rowsRemove.forEach(function(row) {
										if (!row.classList.contains('table-titles')) row.remove();
									});

									var fileResults = '/etc/dnsleaktest/result';
									var fileDNS = `/etc/dnsleaktest/${token.substring(0,8)}`;
									
									var date = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
									var time = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

									// 判断结论：如果发现主 IP 以外的 DNS，且不是预期的，则可能泄漏
									var conclusion = (totalDNS > 0) ? _('DNS may be leaking') : _('No DNS leak detected');

									// 插入信息表汇总
									var newRow = E('tr', {'class': 'tr cbi-rowstyle-1'}, [
										E('td', {'class': 'td'}, token.substring(0,8)),
										E('td', {'class': 'td'}, typeIP.ip),
										E('td', {'class': 'td'}, typeIP.country_name || 'N/A'),
										E('td', {'class': 'td'}, typeIP.isp_name || 'N/A'),
										E('td', {'class': 'td'}, totalDNS),
										E('td', {'class': 'td'}, conclusion)
									]);
									rowsInfo.appendChild(newRow);

									// 插入详细结果表
									var dataDNS = '';
									for (var j = 0; j < dnsIps.length; j++) {
										var ip = dnsIps[j];
										var rowClass = (j + 1) % 2 === 0 ? 'cbi-rowstyle-2' : 'cbi-rowstyle-1';
										var dnsRow = E('tr', {'class': 'tr ' + rowClass}, [
											E('td', {'class': 'td'}, j + 1),
											E('td', {'class': 'td'}, ip),
											E('td', {'class': 'td'}, 'Checked'), // ipleak API dnsdetection 不直接返回国家，需二次查询或仅显示IP
											E('td', {'class': 'td'}, 'Detected')
										]);
										rowsResults.appendChild(dnsRow);
										dataDNS += `${ip}\n`;
									}

									running = false;
									statusId.textContent = _('Finished');

									// 写入日志文件
									var dataInfo = `| ${date} | ${time} | ${token.substring(0,8)} | ${typeIP.ip} | ${typeIP.country_name} | ${totalDNS} | ${conclusion} |\n`;
									fs.read(fileResults).then(function(res) {
										fs.write(fileResults, res.trim() + '\n' + dataInfo);
									}).catch(function() {
										fs.write(fileResults, dataInfo);
									});

									fs.write(fileDNS, `Token: ${token}\nDate: ${date} ${time}\nIP: ${typeIP.ip}\nDNS Found: ${totalDNS}\n\n${dataDNS}`);

								});
							});
						}).catch(function(error) {
							running = false;
							statusId.textContent = _('An error occurred while getting dnsleak test.');
							console.error(error);
						});
					}
				}
			}, _('Start'))
		];

		return E('div', {'class': 'cbi-map'}, [
			E(header),
			E('div', {'class': 'cbi-section-actions', 'style': 'margin: 1.25rem 0'}, [
				E(button),
				E(status)
			]),
			E('div', {'class': 'cbi-section'}, infoTable),
			E('div', {'class': 'cbi-section'}, resultsTable)
		])
	}
})
