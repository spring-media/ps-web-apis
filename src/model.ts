export interface TealiumEventData {
    page_env?: string;
    page_brand?: string;
    page_app_name?: string;
    page_doc_type?: string;
    page_cms_id?: string;
    page_cms_path?: string;
    page_platform?: string;
    page_layout_breakpoint_class?: string;
    page_mode?: string;
    page_template_variant_abc?: string;
    page_template_variant_xyz?: string;
    page_abtest_id?: string;
    page_abtest_variant?: string;
    product_id_array?: string[];
    product_title_array?: string[];
    product_value_array?: string[];
    user_is_loggedin?: string;
    user_sso_id?: string;
    user_c1_tracking_id?: string;
}

export interface TealiumData {
    event_name?: string;
    event_action?: string;
    event_label?: string;
    event_data?: TealiumEventData;
}
