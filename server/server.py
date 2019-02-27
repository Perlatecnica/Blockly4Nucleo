from bottle import get, post, request, route, run ,static_file, redirect, response
import os, shutil

@route('/')
@route('/index')
@route('/blockly4Nnucleo')
def home():
	return static_file('index.html', root = '../')
	
@route('/blockly_compressed.js')
def load_blockly():
	return static_file('blockly_compressed.js', root = '../blockly')
	
@route('/blocks_compressed.js')
def load_blocks():
	return static_file('blocks_compressed.js', root = '../blockly')

@route('/msg/js/en.js')
def load_blockly():
	return static_file('en.js', root = '../blockly/msg/js/')
	
@route('/javascript_compressed.js')
def load_language():
	return static_file('javascript_compressed.js', root = '../blockly')	
	
@route('/nucleo_compressed.js')
def load_language():
	return static_file('nucleo_compressed.js', root = '../blockly')	
	
@route('/favicon.ico')
def load_language():
	return static_file('favicon.ico', root = '../blockly/appengine')	
	
@route('/media/<filename:path>')
def load_language(filename):
	return static_file(filename, root = '../blockly/media')	

@route('/css/materialize.min.css')
def load_materializecss():
	return static_file('materialize.min.css', root = '../css')

@route('/js/materialize.min.js')
def load_materializejs():
	return static_file('materialize.min.js', root = '../js')
	
	
@post('/writeFile')
def write_File():	
	f= open("../main/main.cpp","w+")
	f.write(request.forms.get('textarea'))
	f.close()
	
	os.system("cd ..\main && mbed compile -t GCC_ARM -m"+ str(request.get_cookie("board"))+ " --build BUILD ")
	shutil.move ("..\main\BUILD\main.bin",str(request.get_cookie("boardPath")))
	
	return 
	
@post('/saveBoardSelected')
def save_Board_on_Cookie():
	selval = request.forms.get('board')
	response.set_cookie("board", selval)
	return 'Board scelta: ' + selval
	
@post('/setBoardLetter')
def set_BoardLetter():
	pathBoard = request.forms.get('boardPath')
	response.set_cookie("boardPath", pathBoard)
	return 'Path inserito: '+ pathBoard

# @get('/showCookie')
# def show_Cookie():
		
	# return request.get_cookie("boardPath")	
	
	
run(host='localhost', port=8080, debug=True)