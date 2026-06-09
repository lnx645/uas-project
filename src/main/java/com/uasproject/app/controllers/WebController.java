package com.uasproject.app.controllers;

import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class WebController {

    @GetMapping({
        "/", 
        "/{path:[^\\.]*}", 
        "/**/{path:[^\\.]*}"
    })
    public String welcomePage(Model model, HttpServletRequest request) {
        String uri = request.getRequestURI();
        
        if (uri.startsWith("/api") || uri.startsWith("/swagger-ui") || uri.startsWith("/v3/api-docs")) {
            return "forward:" + uri; 
        }

        if (uri.equals("/template-frontend-root")) {
            return "template-frontend-root";
        }

        model.addAttribute("message", "Welcome to Spring Boot with Thymeleaf!");
        model.addAttribute("items", List.of("Spring Boot", "Thymeleaf", "Bootstrap"));
        
        return "template-frontend-root"; 
    }
}