<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Test extends MY_Controller {

	public function index()
	{
		echo $this->auth->testVar . "<br>\n";
		echo "test class loaded";
	}

	public function setVal($val='312')
	{
		$this->auth->testVar = $val;
	}
	
	public function secret()
	{
		$this->auth->requireLogin();
		
		echo "this is a secret";
	}
	
	public function logout()
	{
		$this->auth->logout("/test");
		
	}

}