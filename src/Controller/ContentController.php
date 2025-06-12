<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ContentController extends AbstractController
{
    #[Route('/content', name: 'app_content')]
    public function index(): Response
    {
        return $this->render('content/index.html.twig');
    }
}
