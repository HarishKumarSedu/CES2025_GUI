cd backend 
call .\env\Scripts\activate
start flask run --debug 
cd .. && cd .\frontend
start npx vite --port 3000