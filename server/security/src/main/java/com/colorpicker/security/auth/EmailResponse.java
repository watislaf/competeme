package com.colorpicker.security.auth;

import io.swagger.v3.oas.annotations.Parameter;

public record EmailResponse(@Parameter(required = true) String emial) {
}
