# zzti-zhihu

设置环境变量:

CMD:
```bash
set DEBUG=zzti-zhihu:*
set env=development
# 注意等号左右不能有空格
```

PowerShell:
```powershell
$env:DEBUG = 'zzti-zhihu:*'
$env:env = 'development'
```

输出调试信息到文件:
```powershell
npm start 2>debug.txt
```
