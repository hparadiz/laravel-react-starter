<?php
namespace App\Libraries;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailableBlade extends Mailable
{
    use Queueable, SerializesModels;

    public string $tpl;
    public $data;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($blade,$data)
    {
        $this->tpl = $blade;
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails/verifyCode',$this->data);
    }
}