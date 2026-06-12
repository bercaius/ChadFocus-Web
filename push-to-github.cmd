@echo off
REM Usage: push-to-github.cmd https://github.com/your-username/your-repo.git
IF "%~1"=="" (
  echo Usage: push-to-github.cmd https://github.com/your-username/your-repo.git
  exit /b 1
)
cd /d "%~dp0"
ngit remote add origin %1
ngit push -u origin master
