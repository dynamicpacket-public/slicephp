<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {
		
	var $model_name;
	var $id_name;
	
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// CONSTRUCTOR
///////////////////////////////////////////////////////////

	function __construct($model_name='', $id_name='')
	{	
		// do whatever CI did before
		parent::__construct();
				
		// if we have db info, lets use it
		if(strlen($model_name) > 2)
		{
			$this->{'model_name'} = $model_name;
			$this->{'id_name'} = $id_name;
		}
		
		// make sure we load auth lib
		$this->load->library('auth');
		$this->load->library('carabiner');
	}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// EVENTS
///////////////////////////////////////////////////////////
	
	function before_add()
	{
		return 1;
	}
		
	function before_delete()
	{
		return 1;
	}	

	function before_update()
	{
		return 1;
	}
	
	function after_add($insertId)
	{
		
	}
		
	function after_update($updateId)
	{
		
	}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// METHOD - Create New <Object>
///////////////////////////////////////////////////////////

	function add()
	{
		// load model (database rep class)
		$this->load->model($this->{'model_name'});

		// allow for hook	
		if(!$this->before_add())
			return 0;

		// try create
		try {
			// do insert
			$id = $this->{$this->{'model_name'}}->create($_POST);
			$this->add_extra($id);
			$this->after_add($id);
			// send response
			$obj = new stdClass();
			$obj->{'resultText'}="Object Created";
			$obj->{'success'}= true;
			$obj->{'createid'}= $id;


			// commit
		    $this->db->trans_commit();
	
			// json!
			$this->output->set_output(json_encode($obj));
		}
		catch (PsyException $e) {
			$this->output->set_output($e->getJSONError());
		}
		
		return (isset($id) && $id > 0) ? $id : 0;
	}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// METHOD - Update OR Create <Object>
///////////////////////////////////////////////////////////

	function update()
    {
		// load model (database rep class)
        $this->load->model($this->{'model_name'});

		// allow for hook	
		if(!$this->before_update())
			return 0;

    	// try create
		try {
            // init blank where
            $where = Array();
            // handle edit mode
            $id = $this->input->get_post($this->{'id_name'});
            if($id && intval($id) > 0 && $this->shouldUpdate())
            {
				// MODE: UPDATE
				$where[$this->{'id_name'}] = $id;
				// get results
				$this->{$this->{'model_name'}}->update($where, $_POST);
				$this->after_update($id);
				// send response
				$obj = new stdClass();
				$obj->{'success'}= true;
								
				// commit
			    $this->db->trans_commit();
				
				// json!
				$this->output->set_output(json_encode($obj));
            }
            else
            {
                // MODE: CREATE
                return $this->add();
            }
		}
		catch (PsyException $e) {
			$this->output->set_output($e->getJSONError());
		}
    }
    
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// METHOD - Delete <Object>
///////////////////////////////////////////////////////////

	function delete()
	{
		// load model (database rep class)
		$this->load->model($this->{'model_name'});

		// allow for hook	
		if(!$this->before_delete())
			return 0;
			
		// try create
		try {
			$id = $this->input->get_post($this->{'id_name'});
			// delete endpoint
			$this->{$this->{'model_name'}}->delete($id);
			// send response
			$obj = new stdClass();
			$obj->{'success'}= true;
			// json!
			$this->output->set_output(json_encode($obj));
		}
		catch (PsyException $e) {
			$this->output->set_output($e->getJSONError());
		}
	}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// METHOD - Get <Object(s)>
///////////////////////////////////////////////////////////

	function get()
	{
		// load model (database rep class)
		$this->load->model($this->{'model_name'});
		// now we populate the model

		// try create
		try {
			// limits
			$limit = $this->input->get_post('limit');
			$offset = $this->input->get_post('start');
			$limit = ($limit ? $limit : $this->defaultLimit() );
			$offset = ($offset ? $offset : 0);
            // init blank where
            $where = Array();
            // handle edit mode
            if (sizeof($this->search_fields()) > 0)
            {
                foreach($this->search_fields() as $key)
                {
                	$val = $this->input->get_post($key);
                	if ($val)
                	{
                    	$where[$key] = $val;
                	}
                }
            }
			// get results
			$res = $this->{$this->{'model_name'}}->get($where, $limit, $offset);
			// send response
			$obj = new stdClass();
            // single result? ie: formLoad?
            if($this->input->get_post('singleton'))
            {
                $obj->{'data'}=$res[0];
            }
            // default, result array
            else
            {
                $obj->{'results'}=$res;
            }
			$obj->{'total'}=(sizeof($res) ? $res[0]->{'results'} : 0);
			$obj->{'success'}= true;
			// json!
			$this->output->set_output(json_encode($obj));
		}
		catch (PsyException $e) {
			$this->output->set_output($e->getJSONError());
		}
	}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// DEFAULTS
///////////////////////////////////////////////////////////

	protected function default_limit()
	{
		return 40;
	}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//// INTERNALS
///////////////////////////////////////////////////////////	

	function index()
	{
		echo ".";
	}
	
	function content($reqContent)
	{
	
	}
			
	protected function search_fields()
	{
	    return Array(
	    //  COLUMN                Clause
	    );
	}
	
	protected function add_extra($id)
	{
		
	}
	
	protected function update_extra($id)
	{
		
	}
}

