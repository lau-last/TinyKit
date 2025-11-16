<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ComponentController extends AbstractController
{
    #[Route('/component', name: 'app_component')]
    public function index(): Response
    {
        return $this->render('component/index.html.twig');
    }


    function twoSum($nums, $target) {
        for ($i = 0; $i < count($nums); $i++) {
            for ($j = 0; $j < count($nums); $j++) {
                if ($nums[$i] === $nums[$j]) {
                    $j++;
                }
                if ($nums[$i] + $nums[$j] === $target) {
                    return [$i, $j];
                }
            }
        }
    }
}
