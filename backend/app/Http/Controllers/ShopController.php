<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use App\Http\Requests\StoreShopRequest;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShopRequest $request)
    {
        $data = $request->validated();
        return response()->json($data);
    }
    /**
     * Display the specified resource.
     */
    public function show(Shop $shop)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shop $shop)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shop $shop)
    {
        //
    }
}
