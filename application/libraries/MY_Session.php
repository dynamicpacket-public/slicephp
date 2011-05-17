<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class MY_Session extends CI_Session {

    public function __construct()
    {
        parent::__construct();
    }

	/*    
	    function _serialize($data)
	    {
	        return json_encode($data);
	    }
	    
	    function _unserialize($data)
	    {
	        return json_decode($data,true);
	    }
    */
    
}